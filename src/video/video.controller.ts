import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Video } from '@prisma/client';
import { CreateVideoDTO } from './dtos/create-video.dto';
import { VideoService } from './video.service';

@ApiTags('동영상')
@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  @ApiOperation({summary: '동영상 전체 조회', description: '전체 동영상을 조회합니다.'})
  async getVideos(): Promise<Video[]> {
    return this.videoService.findVideos({});
  }


  @Get('search')
  @ApiOperation({summary: '동영상 검색', description: '동영상을 검색합니다. (제목 or 해시태그 or 카테고리'})
  async getVideoBySearch(
    @Query('query') query: string
  ): Promise<Video[]> {
    return this.videoService.findVideos({
      where: {
        OR: [
          { title: { contains: query } },
          { hashTag: { contains: query } },
          { category: { contains: query } }
        ]
      }
    });
  }

  @Get(':id')
  @ApiOperation({summary: '동영상 id 번호로 조회', description: '특정 id의 동영상을 조회합니다.'})
  async getVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Video> {
    return this.videoService.findVideo({ id })
  }

  @Post()
  @ApiOperation({summary: '동영상 생성', description: '동영상을 생성합니다.'})
  async createVideo(
    @Body() body: CreateVideoDTO
  ): Promise<Video> {
    console.log(body)
    if (!body) {
      throw new BadRequestException('?')
    }
    return this.videoService.createVideo(body)
  }

  @Patch(':id')
  @ApiOperation({summary: '특정 id의 동영상 수정', description: '특정 id의 동영상을 수정합니다.'})
  async updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() video: Video
  ): Promise<Video> {
    return this.videoService.updateVideo({
      where: { id },
      data: video
    });
  }

  @Delete(':id')
  @ApiOperation({summary: '특정 id의 동영상 삭제', description: '특정 id의 동영상을 삭제합니다.'})
  async deleteVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Video> {
    return this.videoService.deleteVideo({
      id
    })
  }
}
