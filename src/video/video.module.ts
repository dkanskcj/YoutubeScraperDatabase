import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentService } from 'src/comment/comment.service';

@Module({
  controllers: [VideoController],
  providers: [VideoService, PrismaService, CommentService],
  exports: [VideoService]
})
export class VideoModule {}
