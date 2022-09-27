import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { deleteCommentDTO } from './dtos/delete-comment.dto';
import { UpdateCommentDTO } from './dtos/update-comment.dto';

@ApiTags('댓글')
@Controller('')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private prismaService: PrismaService

  ) { }


  @Get('')
  @ApiOperation({ summary: '댓글 전체 조회', description: '댓글을 전체 조회합니다.' })
  async getCommet(): Promise<Comment[]> {
    return this.commentService.findComments({});
  }


  @Get('search/:name')
  @ApiOperation({ summary: '특정 사용자의 댓글을 조회합니다.', description: '특정 사용자가 작성한 전체 댓글을 조회합니다.' })
  async getCommentById(
    @Param('name') name: string
  ): Promise<Comment[]> {
    const user = await this.prismaService.user.findFirst({ where: { name }, include: { comments: true } });
    if (!user) {
      throw new NotFoundException('입력한 이름과 일치하는 사용자를 찾을 수 없습니다.');
    }
    
    return user.comments;
  }

  @Get('search/:id')
  @ApiOperation({ summary: '특정 video id의 전체 댓글을 조회합니다.', description: '특정 video의 id를 선택하면 해당 id에 있는 댓글들을 조회합니다.' })
  async getCommentsBySearchWithVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Comment[]> {
    const video = await this.prismaService.video.findUnique({ where: { id } });
    if (!video) {
      throw new BadRequestException('Video ID를 찾을 수 없습니다.')
    }
    return this.commentService.findComments({
      where: {
        OR: [
          { videoId: id }
        ]
      }
    });
  }



  @Post('search/:name/video:videoId')
  @ApiOperation({ summary: '해당 영상에 댓글을 생성합니다.', description: '아이디와 댓글을 검증하여 맞으면 해당 영상에 댓글을 생성합니다.' })
  async createComment(
    @Param('videoId', new ParseIntPipe()) videoId: number,
    @Param('name') name: string,
    @Body() body: CreateCommentDTO
  ): Promise<Comment> {
    const user = await this.prismaService.user.findFirst({
      where: {
        name: name,
        password: body.password
      }
    });
    if (!user) {
      throw new NotFoundException('유저 정보를 찾을 수 없습니다.')
    }
    const video = await this.prismaService.video.findUnique({ where: { id: videoId } });
    if (!video) {
      throw new NotFoundException('동영상을 찾을 수 없습니다.')
    }
    if(body.name !== name){
      throw new BadRequestException('입력된 아이디가 올바르지 않습니다.')
    }
    return this.commentService.createComment(body, videoId, user.id);
  }

  @Patch(':userId')
  @ApiOperation({ summary: '댓글을 수정합니다.', description: '비밀번호 일치 여부를 조회하여 일치한다면 댓글을 수정할 수 있습니다.' })
  async updateComment(
    @Param('userId', new ParseIntPipe()) id: number,
    @Body() body: UpdateCommentDTO
  ): Promise<Comment> {
    // 아이디 찾기
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.')
    }
    // 비밀번호 검증
    if (body.password !== user.password) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.')
    }

    return this.commentService.updateComment({
      where: { id },
      data: {
        content: body.content
      }
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: '특정 id의 댓글을 삭제합니다.', description: '비밀번호를 비교하여 비밀번호가 일치한다면 해당 댓글을 삭제합니다.' })
  async deleteComment(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: deleteCommentDTO
  ): Promise<Comment> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.')
    }
    if (body.password !== user.password) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.')
    }

    return this.commentService.deleteComment({
      id
    });
  }
}
