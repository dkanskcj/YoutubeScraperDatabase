import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VideoService } from 'src/video/video.service';
import { CommentService } from './comment.service';
import { Comment, Video } from '@prisma/client';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { UpdateCommentDTO } from './dtos/update-comment.dto';
import { deleteCommentDTO } from './dtos/delete-comment.dto';

@ApiTags('댓글')
@Controller('')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly videoService: VideoService
  ) { }


  @Get('')
  @ApiOperation({ summary: '댓글 전체 조회', description: '댓글을 전체 조회합니다.' })
  async getCommet(): Promise<Comment[]> {
    return this.commentService.findComments({});
  }


  @Get(':id')
  @ApiOperation({ summary: '특정 id의 댓글을 조회합니다.', description: '특정 id의 댓글을 조회합니다.' })
  async getCommentById(@Param('id', new ParseIntPipe()) id: number): Promise<Comment> {
    console.log(id)
    const videoId = await this.videoService.findVideo({ id });
    const commentId = await this.commentService.findComment({})

    // return 
    return this.commentService.findComment({ id });
  }

  @Get('search/:id')
  @ApiOperation({ summary: '특정 video id의 전체 댓글을 조회합니다.', description: '특정 video의 id를 선택하면 해당 id에 있는 댓글들을 조회합니다.' })
  async getCommentsBySearchWithVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Comment[]> {
    const video = await this.videoService.findVideo({ id })
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
    // return this.videoService.findVideo({ id });
  }



  @Post(':videoId')
  @ApiOperation({ summary: '아이디, 비밀번호, 댓글을 생성합니다.', description: '아이디와 비밀번호를 생성하면서 댓글을 생성합니다.' })
  async createComment(
    @Param('videoId', new ParseIntPipe()) videoId: number,
    @Body() body: CreateCommentDTO
  ): Promise<Comment> {
    const video = await this.videoService.findVideo({ id: videoId });
    if (!video) {
      throw new NotFoundException('동영상을 찾을 수 없습니다.')
    }


    return this.commentService.createComment(body, videoId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '댓글을 수정합니다.', description: '비밀번호 일치 여부를 조회하여 일치한다면 댓글을 수정할 수 있습니다.' })
  async updateComment(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateCommentDTO
  ): Promise<Comment> {
    // 아이디 찾기
    const comment = await this.commentService.findComment({ id })

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.')
    }
    // 비밀번호 검증
    if (body.password !== comment.password) {
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
    const comment = await this.commentService.findComment({ id })
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.')
    }
    if (body.password !== comment.password) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.')
    }

    return this.commentService.deleteComment({
      id
    });
  }
}
