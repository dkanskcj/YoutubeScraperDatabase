import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { ContentService } from './content/content.service';
import { PrismaService } from './prisma/prisma.service';
import { CommentService } from './comment/comment.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserService, ContentService, PrismaService, CommentService],
})
export class AppModule { }
