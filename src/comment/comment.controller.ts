import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CryptoSerivce } from 'src/crypto/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentService } from './comment.service';
import { CommentDTO } from './dtos/comment.dto';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { CreateBodyCommentDTO } from './dtos/createBody-comment.dto';
import { deleteCommentDTO } from './dtos/delete-comment.dto';
import { GetCommentDTO } from './dtos/get-comment.dto';
import { GetCommentsDTO } from './dtos/get-comments.dto';
import { UpdateCommentDTO } from './dtos/update-comment.dto';

@ApiTags('댓글')
@Controller('')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private prismaService: PrismaService,
    private cryptoService: CryptoSerivce
  ) { }


  @Get('')
  @ApiOperation({ summary: '댓글 전체 조회', description: '댓글을 전체 조회합니다.' })
  async getCommet(): Promise<GetCommentsDTO[]> {
    const user = await this.prismaService.user.findMany({});
    console.log(user)
    const comments = await this.prismaService.comment.findMany({
      select: {
        id: true,
        videoId: true,
        // name: true,
        content: true,
        // password: false,
        createdAt: true
      }
    })
    if (!comments) {
      throw new NotFoundException('댓글이 존재하지 않습니다')
    }
    return comments
  }


  @Get('search/:id')
  @ApiOperation({ summary: '특정 사용자의 댓글을 조회합니다.', description: '특정 사용자가 작성한 전체 댓글을 조회합니다.' })
  async getCommentById(
    @Param('id', new ParseIntPipe()) id: number
    // @Param('name') name: string
  ): Promise<GetCommentDTO[]> {
    const comment = await this.prismaService.comment.findUnique({ where: { id } })
    const comments = await this.prismaService.comment.findMany({
      where: {
        userId: id
      },
      select: {
        userId: true,
        id: true,
        content: true,
        createdAt: true,
      }
    })
    if (!comment) {
      throw new NotFoundException('입력한 이름과 일치하는 사용자를 찾을 수 없습니다.');
    }
    if (!comments) {
      throw new NotFoundException('해당 사용자의 댓글을 찾을 수 없습니다.')
    }

    return comments
  }

  @Get('search:videoId')
  @ApiOperation({ summary: '특정 video id의 전체 댓글을 조회합니다.', description: '특정 video의 id를 선택하면 해당 id에 있는 댓글들을 조회합니다.' })
  async getCommentsBySearchWithVideo(
    @Param('videoId', new ParseIntPipe()) id: number
  ): Promise<CommentDTO[]> {
    const video = await this.prismaService.video.findUnique({ where: { id } });
    if (!video) {
      throw new NotFoundException('Video ID를 찾을 수 없습니다.')
    }

    const comments = await this.prismaService.comment.findMany({
      where: {
        video: {
          id: video.id
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return plainToInstance(CommentDTO, comments);
  }



  @Post('createWithVideoId=:videoId')
  @ApiOperation({ summary: '해당 영상에 댓글을 생성합니다.', description: '아이디와 댓글을 검증하여 맞으면 해당 영상에 댓글을 생성합니다.' })
  async createComment(
    @Param('videoId', new ParseIntPipe()) videoId: number,
    @Body() body: CreateBodyCommentDTO
  ): Promise<CreateCommentDTO> {
    const video = await this.prismaService.video.findUnique({ where: { id: videoId } });
    if (!video) {
      throw new NotFoundException('동영상을 찾을 수 없습니다.')
    }

    if (!body.name) {
      throw new BadRequestException('아이디를 입력해 주시기 바랍니다.')
    }
    const user = await this.prismaService.user.findFirst({
      where: {
        name: body.name
      }
    })
    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
    if (body.name !== user.name || body.password !== user.password) {
      const check = await this.cryptoService.checkPassword(user.password, body.password)
      if (check) {
        const create = plainToInstance(CreateCommentDTO, body);
        return this.commentService.createComment(create, videoId, user.id)
      }
      else {
        throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다.')
      }
    }
    const create = plainToInstance(CreateCommentDTO, body);
    return this.commentService.createComment(create, videoId, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '댓글을 수정합니다.', description: '비밀번호 일치 여부를 조회하여 일치한다면 댓글을 수정할 수 있습니다.' })
  async updateComment(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateCommentDTO
  ): Promise<GetCommentDTO> {
    // 아이디 찾기
    const comment = await this.prismaService.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException(comment)
      // throw new NotFoundException('사용자를 찾을 수 없습니다.')
    }
    const user = await this.prismaService.user.findFirst({
      where: {
        name: body.name
      }
    })
    if (user) {
      const hashPassword = await this.cryptoService.Encryption(user.name, user.password);
      const check = await this.cryptoService.checkPassword(user.password, hashPassword.password)
      if (check === true) {
        const update = await this.commentService.updateComment({
          where: { id },
          data: {
            content: body.content
          }
        })
        return plainToInstance(GetCommentDTO, update);
      }
      else {
        if (user.name !== body.name || user.password !== body.password) {
          throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다.')
        }
        else {
          const update = await this.commentService.updateComment({
            where: { id },
            data: {
              content: body.content
            }
          })
          return plainToInstance(GetCommentDTO, update);
        }
      }
    }
    return;
  }

  @Patch(':id/delete')
  @ApiOperation({ summary: '특정 id의 댓글을 삭제합니다.', description: '비밀번호를 비교하여 비밀번호가 일치한다면 해당 댓글을 삭제합니다.' })
  async deleteComment(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: deleteCommentDTO
  ): Promise<Comment> {
    const comment = await this.prismaService.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.')
    }
    const user = await this.prismaService.user.findFirst({
      where: {
        name: body.name
      }
    })
    const check = await this.cryptoService.checkPassword(user.password, body.password)
    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.')
    }
    else if (user.password !== body.password) {
      if (check === true) {
        return this.commentService.deleteComment({ id })
      }
      throw new BadRequestException('비밀번호가 일치하지 않습니다.')
    }
    const checkComment = await this.prismaService.comment.findFirst({
      where: {
        userId: user.id,
        content: comment.content
      }
    })
    if (!checkComment) {
      throw new NotFoundException('해당 유저의 해당 댓글을 찾을 수 없습니다.')
    }
    if (check === true) {
      return this.commentService.deleteComment({ id })
    }
    else {
      if (user.name !== body.name || user.password !== body.password) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다.')
      }
      else {
        return this.commentService.deleteComment({ id })
      }
    }
  }
}
