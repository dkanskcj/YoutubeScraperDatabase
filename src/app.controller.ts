import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Comment, Video } from '@prisma/client';
import { CommentService } from './comment/comment.service';
import { CreateCommentDTO } from './comment/dtos/create-comment.dto';
import { UpdateCommentDTO } from './comment/dtos/update-comment.dto';
import { ContentService } from './content/content.service';
import { UserService } from './user/user.service';
import { CreateVideoDTO } from './video/dtos/create-video.dto';
import { VideoService } from './video/video.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly contentService: ContentService,
    private readonly commentService: CommentService,
    private readonly videoService: VideoService
  ) { }
}
