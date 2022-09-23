import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User, Comment } from '@prisma/client';
import { CommentService } from './comment/comment.service';
import { ContentService } from './content/content.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly contentService: ContentService,
    private readonly commentService: CommentService
  ) {}

  @Get('user')
  async getUsers(): Promise<User[]>{
    return this.userService.Users({});
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    console.log(id)

    return this.userService.User({ id: Number(id) });
  }

  @Get('user/:queue')
  async getUserBySearch(
    @Param('queue') queue: string
  ): Promise<User[]>{
    return this.userService.Users({
      where: {
      }
    });
  }

  @Post('user')
  async createUser(
    @Body() user: User
  ): Promise<User>{
    return this.userService.createUser(user);
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: User
  ): Promise<User>{
    return this.userService.updateUser({
      where: { id : Number(id) },
      data: user
    });
  }

  @Delete('user/:id')
  async deleteUser(
    @Param('id') id: String
  ): Promise<User>{
    return this.userService.deleteUser({
      id: Number(id)
    });
  }


  @Get('comment')
  async getCommet(): Promise<Comment[]>{
    return this.commentService.Comments({});
  }

  @Get('comment/:id')
  async getCommentById(@Param('id') id: string): Promise<Comment>{
    console.log(id)

    return this.commentService.Comment({ id: Number(id) });
  }

  @Get('comment/:queue')
  async getCommentBySearch(
    @Param('queue') queue: string
  ): Promise<Comment[]>{
    return this.commentService.Comments({
      where: {

      }
    });
  }

  @Post('comment')
  async createComment(
    @Body() comment: Comment
  ): Promise<Comment>{
    return this.commentService.createComment(comment);
  }

  @Put('comment/:id')
  async updateComment(
    @Param('id') id: Number,
    @Body() comment: Comment
  ): Promise<Comment>{
    return this.commentService.updateComment({
      where: { id: Number(id) },
      data: comment
    });
  }

  @Delete('comment/:id')
  async deleteComment(
    @Param('id') id: Number
  ): Promise<Comment>{
    return this.commentService.deleteComment({
      id: Number(id)
    });
  }
}
