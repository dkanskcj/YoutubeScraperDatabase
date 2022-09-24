import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Comment, Video } from '@prisma/client';
import { CommentService } from './comment/comment.service';
import { CreateCommentDTO } from './comment/dtos/create-comment.dto';
import { UpdateCommentDTO } from './comment/dtos/update-comment.dto';
import { ContentService } from './content/content.service';
import { UserService } from './user/user.service';
import { VideoService } from './video/video.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly contentService: ContentService,
    private readonly commentService: CommentService,
    private readonly videoSerivce: VideoService
  ) { }


  // user




  // comment
  @Get('comment')
  async getCommet(): Promise<Comment[]> {
    return this.commentService.findComments({});
  }

  @Get('comment/:id')
  async getCommentById(@Param('id', new ParseIntPipe()) id: number): Promise<Comment> {
    console.log(id)

    return this.commentService.findComment({ id });
  }

  @Get('comment/:query')
  async getCommentBySearch(
    @Param('query') query: string
  ): Promise<Comment[]> {
    return this.commentService.findComments({
      where: {

      }
    });
  }

  @Post('comment/:videoId')
  async createComment(
    @Param('videoId', new ParseIntPipe()) videoId: number,
    @Body() body: CreateCommentDTO
  ): Promise<Comment> {
    const video = await this.videoSerivce.findVideo({ id: videoId });
    if (!video) {
      throw new NotFoundException('동영상을 찾을 수 없습니다.')
    }


    return this.commentService.createComment(body, videoId);
  }

  @Patch('comment/:id')
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

  @Delete('comment/:id')
  async deleteComment(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Comment> {
    return this.commentService.deleteComment({
      id
    });
  }

  @Get('video')
  async getVideos(): Promise<Video[]> {
    return this.videoSerivce.findVideos({});
  }

  @Get('video/:id')
  async getVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Video> {
    return this.videoSerivce.findVideo({ id })
  }

  @Get('video/:query')
  async getVideoBySearch(
    @Param('query') query: string
  ): Promise<Video[]> {
    return this.videoSerivce.findVideos({
      where: {
        OR: [
          { title: { contains: query } },
          { hashTag: { contains: query } },
          { category: { contains: query } }
        ]
      }
    });
  }

  @Post('video')
  async createVideo(
    @Body() video: Video
  ): Promise<Video> {
    return this.videoSerivce.createVideo(video)
  }

  @Patch('video/:id')
  async updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() video: Video
  ): Promise<Video> {
    return this.videoSerivce.updateVideo({
      where: { id },
      data: video
    });
  }

  @Delete('video/:id')
  async deleteVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Video> {
    return this.videoSerivce.deleteVideo({
      id
    })
  }
}
