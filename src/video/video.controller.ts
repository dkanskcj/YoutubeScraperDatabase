import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Video } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVideoDTO } from './dtos/create-video.dto';
import { UpdateVideoDTO } from './dtos/update-video.dto';
import { VideoService } from './video.service';

@ApiTags('동영상')
@Controller()
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private prismaService: PrismaService
  ) { }


  @Get('')
  @ApiOperation({ summary: '동영상 전체 조회', description: '전체 동영상을 조회합니다.' })
  async getVideos(
    @Query('pageNo') pageNo: number,
    @Query('pageSize', new ParseIntPipe()) pageSize: number
  ) {
    console.log({ pageNo, pageSize })
    
    const videos = await this.videoService.findVideos({
      skip: (pageNo - 1) * pageSize,
      take: pageSize
    });

    const count = await this.videoService.totalVideo();
    const result = {
      items: videos,
      count
    }
    return result;
  }
  // async getVideos(): Promise<Video[]> {
  //   return this.videoService.findVideos({});
  // }

  @Get('search')
  @ApiOperation({ summary: '동영상 검색', description: '동영상을 검색합니다. (제목 or 해시태그 or 카테고리' })
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
  @ApiOperation({ summary: '동영상 id 번호로 조회', description: '특정 id의 동영상을 조회합니다.' })
  async getVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Video> {
    const video = await this.prismaService.video.findUnique({ where: { id } })
    if (!video) {
      throw new NotFoundException('등록되지 않았거나 찾을 수 없는 영상입니다.')
    }
    return this.videoService.findVideo({ id })
  }

  @Post()
  @ApiOperation({ summary: '동영상 생성', description: '제목, 카테고리, url을 입력하고 카테고리는 HTML, tailwindcss, JavaScript, Angular, React 5개만 받고 동영상을 생성합니다. 카테고리에 존재하지 않는 형식은 생성하지 못하며, 중복된 url도 동영상 생성이 불가능합니다.' })
  async createVideo(
    @Body() body: CreateVideoDTO
  ): Promise<Video> {
    const video = await this.prismaService.video.findFirst({ where: { url: body.url } });
    if (video) {
      throw new NotFoundException('이미 등록된 영상이 존재합니다. 다른 영상을 등록해주시길 바랍니다.')
    }
    if (!body) {
      throw new BadRequestException('입력된 동영상이 없습니다.')
    }
    if (!body.title) {
      throw new BadRequestException('동영상 제목을 입력해주시기 바랍니다.')
    }
    if (!body.url) {
      throw new BadRequestException('동영상 url을 입력해주시기 바랍니다.')
    }
    if (body.category !== ('HTML' || 'tailwindcss' || 'JavaScript' || 'Angular' || 'React')) {
      throw new BadRequestException('올바른 카테고리가 아닙니다. 정해진 카테고리에서 선택해 주시길 바랍니다.')
    }
    return this.videoService.createVideo(body)
  }

  @Patch(':id')
  @ApiOperation({ summary: '특정 id의 동영상 수정', description: '특정 id의 동영상을 수정합니다.' })
  async updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVideoDTO
  ): Promise<Video> {
    const video = await this.prismaService.video.findUnique({ where: { id } })
    if (!video) {
      throw new NotFoundException('등록되지 않았거나 찾을 수 없는 영상입니다.')
    }
    if (body.category !== ('HTML' || 'tailwindcss' || 'JavaScript' || 'Angular' || 'React')) {
      throw new BadRequestException('올바른 카테고리가 아닙니다. 정해진 카테고리에서 선택해 주시길 바랍니다.')
    }
    return this.videoService.updateVideo({
      where: { id },
      data: body
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: '특정 id의 동영상 삭제', description: '특정 id의 동영상을 삭제합니다.' })
  async deleteVideo(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<Video> {
    const video = await this.prismaService.video.findUnique({ where: { id } })
    if (!video) {
      throw new NotFoundException('등록되지 않았거나 찾을 수 없는 영상입니다.')
    }
    return this.videoService.deleteVideo({
      id
    })
  }
}
