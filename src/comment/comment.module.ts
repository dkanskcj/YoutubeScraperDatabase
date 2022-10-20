import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { VideoService } from 'src/video/video.service';
import { UserService } from 'src/user/user.service';
import { CryptoSerivce } from 'src/crypto/crypto.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaService, VideoService, UserService, CryptoSerivce],
  exports: [CommentService]
})
export class CommentModule {}
