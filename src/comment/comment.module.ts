import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { VideoService } from 'src/video/video.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaService, VideoService],
  exports: [CommentService]
})
export class CommentModule {}
