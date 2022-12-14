import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Video } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentDTO } from 'src/comment/dtos/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryPaginationVideo } from './dtos/categoryPagination-video.dto';
import { CreateVideoDTO } from './dtos/create-video.dto';
import { UpdateVideoDTO } from './dtos/update-video.dto';
import { VideoDTO } from './video.dto';
import { VideoService } from './video.service';

@ApiTags('동영상')
@Controller()
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private prismaService: PrismaService,
    private commentService: CommentService
  ) { }


  @Get('all')
  @ApiOperation({ summary: '동영상 전체 조회', description: '전체 동영상을 조회합니다.(카테고리 별로 5개씩' })
  async allVideos() {
    let videos = {
      angular: [],
      tailwindcss: [],
      javascript: [],
      react: [],
      html: []
    }

    const Angulars = await this.prismaService.video.findMany({
      where: {
        category: 'Angular',
      },
      take: 5,
    });
    const tailwinds = await this.prismaService.video.findMany({
      where: {
        category: 'tailwindcss'
      },
      take: 5
    });
    const JavaScripts = await this.prismaService.video.findMany({
      where: {
        category: 'JavaScript'
      },
      take: 5
    });
    const Reacts = await this.prismaService.video.findMany({
      where: {
        category: 'React'
      },
      take: 5
    });
    const HTMLs = await this.prismaService.video.findMany({
      where: {
        category: 'HTML'
      },
      take: 5
    });


    videos = {
      angular: [...plainToInstance(VideoDTO, Angulars)],
      tailwindcss: [...plainToInstance(VideoDTO, tailwinds)],
      javascript: [...plainToInstance(VideoDTO, JavaScripts)],
      react: [...plainToInstance(VideoDTO, Reacts)],
      html: [...plainToInstance(VideoDTO, HTMLs)],
    }

    // if (!videos) {
    //   throw new NotFoundException('해당 카테고리의 동영상이 존재하지 않습니다.')
    // }

    return videos;
  }

  @Get('')
  @ApiOperation({ summary: '동영상 전체 조회(페이지네이션)', description: 'pageNo에 있는 pageSize만큼 동영상을 조회합니다.' })
  async getVideos(
    @Query('pageNo', new ParseIntPipe()) pageNo: number,
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
  ) {
    console.log({ pageNo, pageSize })

    const videos = await this.videoService.findVideos({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });
    if (!videos) {
      throw new NotFoundException('동영상을 찾을 수 없습니다.')
    }

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
  @ApiOperation({ summary: '카테고리로 동영상 검색', description: '동영상을 검색합니다. (카테고리)' })
  async getVideoBySearch(
    @Query('query') query: string
  ): Promise<Video[]> {
    let youtube = 'https://www.youtube.com/embed';
    const videos = await this.videoService.findVideos({
      where: {
        OR: [
          // { title: { contains: query } },
          // { hashTag: { contains: query } },
          { category: { contains: query } }
        ]
      }
    });
    if (!videos) {
      throw new NotFoundException('해당 카테고리의 동영상이 존재하지 않습니다.')
    }
    for (let video of videos) {
      if(video.url.indexOf("https://www.youtube.com/watch?v=") === 0){
        video.url = video.url.substring(32);
        video.url = youtube.concat('/' + video.url);
      }
      else if (video.url.indexOf("https://www.youtube.com") === 0) {
        video.url = video.url.substring(23);
        video.url = youtube.concat(video.url);
      }
      else if (video.url.indexOf("http://www.youtube.com") === 0) {
        video.url = video.url.substring(22);
        video.url = youtube.concat(video.url);
      }
      else if (video.url.indexOf("https://youtu.be") === 0) {
        video.url = video.url.substring(16);
        video.url = youtube.concat(video.url);
      }
    }
    return videos;
  }
  // https://www.youtube.com/watch?v=oC8evW7o-Mc

  @Get('thumbNailImg')
  @ApiOperation({ summary: '유튜브 영상의 썸네일을 가져옵니다.', description: '유튜브 영상의 고유 ID값만 따로 추출해서 썸네일 데이터를 만들 수 있게 만들어줍니다.' })
  async getVideosThumbNailImg(
    @Query('query') query: string
  ): Promise<Video[]> {
    let thumbNail: string = 'https://img.youtube.com/vi/';
    let defaultImg: string = '/mqdefault.jpg';
    const videos = await this.videoService.findVideos({
      where: {
        OR: [
          { category: { contains: query } }
        ]
      }
    });
    if (!videos) {
      throw new NotFoundException('동영상이 존재하지 않습니다.')
    }
    for (let video of videos) {
      if(video.url.indexOf("https://www.youtube.com/watch?v=") === 0){
        video.url = video.url.substring(32);
        video.url = thumbNail.concat(video.url + defaultImg);
      }
      if (video.url.indexOf("https://www.youtube.com") === 0) {
        video.url = video.url.substring(24);
        video.url = thumbNail.concat(video.url + defaultImg);
      }
      if (video.url.indexOf("http://www.youtube.com") === 0) {
        video.url = video.url.substring(23);
        video.url = thumbNail.concat(video.url + defaultImg);
      }
      if (video.url.indexOf("https://youtu.be") === 0) {
        video.url = video.url.substring(17);
        video.url = thumbNail.concat(video.url + defaultImg);
      }
    }
    return videos;
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
    if (body.url.includes('youtu') === false) {
      throw new BadRequestException('유튜브 영상만 올릴 수 있습니다.')
    }
    if (body.category === 'HTML' || body.category === 'JavaScript' || body.category === 'Angular' || body.category === 'React' || body.category === 'tailwindcss') {
      return this.videoService.createVideo(body);
    }
    else {
      throw new BadRequestException('카테고리 형식이 옳지 않습니다. 정해진 카테고리 내에서 선택해주시길 바랍니다.')
    }
    return;
  }

  @Patch(':id')
  @ApiOperation({ summary: '특정 id의 동영상 수정', description: '특정 id의 동영상을 수정합니다.' })
  async updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVideoDTO
  ): Promise<UpdateVideoDTO> {
    const video = await this.prismaService.video.findUnique({ where: { id } })
    if (!video) {
      throw new NotFoundException('등록되지 않았거나 찾을 수 없는 영상입니다.')
    }
    const categories = ['HTML' , 'tailwindcss' , 'JavaScript' , 'Angular' , 'React'];
    if (!categories.includes(body.category)) {
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
    const comments = await this.prismaService.comment.deleteMany({ where: { videoId: id } })
    if (!comments) {
      return this.videoService.deleteVideo({ id })
    }
    return this.videoService.deleteVideo({ id });
  }
}
