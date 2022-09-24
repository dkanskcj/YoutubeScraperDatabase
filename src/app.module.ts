import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { ContentService } from './content/content.service';
import { PrismaService } from './prisma/prisma.service';
import { CommentService } from './comment/comment.service';
import { VideoService } from './video/video.service';
import { TestModule } from './test/test.module';

@Module({
  imports: [TestModule],
  controllers: [AppController],
  providers: [AppService, UserService, ContentService, PrismaService, CommentService, VideoService],
})
export class AppModule { }
