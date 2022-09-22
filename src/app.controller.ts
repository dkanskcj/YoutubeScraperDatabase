import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { ContentService } from './content/content.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly contentService: ContentService
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

}
