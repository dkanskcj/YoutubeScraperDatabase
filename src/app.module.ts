import { Module } from '@nestjs/common';
import { AppRoutingModule } from './app-routing.module';
import { AppService } from './app.service';
import { CommentService } from './comment/comment.service';
import { ContentService } from './content/content.service';
import { PrismaService } from './prisma/prisma.service';
import { TestModule } from './test/test.module';
import { UserService } from './user/user.service';
import { VideoModule } from './video/video.module';
import { VideoService } from './video/video.service';

@Module({
  imports: [TestModule, VideoModule, AppRoutingModule],
  providers: [AppService, UserService, ContentService, PrismaService, CommentService, VideoService],
})
export class AppModule { }
