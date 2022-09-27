import { Module } from '@nestjs/common';
import { AppRoutingModule } from './app-routing.module';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { CommentService } from './comment/comment.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { VideoModule } from './video/video.module';
import { VideoService } from './video/video.service';

@Module({
  imports: [ VideoModule, AppRoutingModule, CommentModule, UserModule],
  providers: [AppService, PrismaService, CommentService, VideoService, UserService],
})
export class AppModule { }
