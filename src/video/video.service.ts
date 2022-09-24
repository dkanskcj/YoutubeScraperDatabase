import { Injectable } from '@nestjs/common';
import { Prisma, Video } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVideoDTO } from './dtos/create-video.dto';

@Injectable()
export class VideoService {
    constructor(
        private prisma: PrismaService
    ){}
    async findVideo(
        VideoWhereUniqueInput: Prisma.VideoWhereUniqueInput
    ): Promise<Video | null> {
        console.log('VideoWhereUniqueInput: ', VideoWhereUniqueInput)
        
        return await this.prisma.video.findUnique({
            where: VideoWhereUniqueInput
        })
    }

    async findVideos(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.VideoWhereUniqueInput;
        where?: Prisma.VideoWhereInput;
        orderBy?: Prisma.VideoOrderByWithRelationInput;
    }): Promise<Video[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return await this.prisma.video.findMany({
            skip, take, cursor, where, orderBy
        });
    }

    async createVideo(body: CreateVideoDTO): Promise<Video>{
        return await this.prisma.video.create({
            data: {
                ...body
            }
        })
    }


    async updateVideo(params: {
        where: Prisma.VideoWhereUniqueInput;
        data: Prisma.VideoUpdateInput;
    }): Promise<Video> {
        const { where, data } = params;
        return await this.prisma.video.update({
            data, where
        });
    }

    async deleteVideo(where: Prisma.VideoWhereUniqueInput): Promise<Video>{
        return await this.prisma.video.delete({
            where
        });
    }
}
