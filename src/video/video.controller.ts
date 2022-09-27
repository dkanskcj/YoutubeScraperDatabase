import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Video } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVideoDTO } from './dtos/create-video.dto';
import { VideoService } from './video.service';

@ApiTags('동영상')
@Controller()
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private prismaService: PrismaService
    ) {}

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
    const video = await this.prismaService.video.findUnique({ where: { id }})
    if(!video){
      throw new NotFoundException('등록되지 않았거나 찾을 수 없는 영상입니다.')
    }
    return this.videoService.findVideo({ id })
  }

  @Post()
  @ApiOperation({summary: '동영상 생성', description: '동영상을 생성합니다.'})
  async createVideo(
    @Body() body: CreateVideoDTO
  ): Promise<Video> {
    if (!body) {
      throw new BadRequestException('입력된 동영상이 없습니다.')
    }
    if(!body.title){
      throw new BadRequestException('동영상 제목을 입력해주시기 바랍니다.')
    }
    if(!body.thumbNail){
      throw new BadRequestException('동영상 썸네일을 입력해주시기 바랍니다.')
    }
    return this.videoService.createVideo(body)
  }

  @Patch(':id')
  @ApiOperation({summary: '특정 id의 동영상 수정', description: '특정 id의 동영상을 수정합니다.'})
  async updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateVideoDTO
  ): Promise<Video> {
    const video = await this.prismaService.video.findUnique({ where: { id }})
    if(!video){
      throw new NotFoundException('등록되지 않았거나 찾을 수 없는 영상입니다.')
    }
    return this.videoService.updateVideo({
      where: { id },
      data: body
    });
  }

  @Delete(':id')
  @ApiOperation({summary: '특정 id의 동영상 삭제', description: '특정 id의 동영상을 삭제합니다.'})
  async deleteVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Video> {
    const video = await this.prismaService.video.findUnique({ where: { id }})
    if(!video){
      throw new NotFoundException('등록되지 않았거나 찾을 수 없는 영상입니다.')
    }
    return this.videoService.deleteVideo({
      id
    })
  }
}
