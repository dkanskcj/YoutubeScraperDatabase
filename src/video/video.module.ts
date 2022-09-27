import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VideoController],
  providers: [VideoService, PrismaService],
  exports: [VideoService]
})
export class VideoModule {}