import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { GetCommentsDTO } from './dtos/get-comments.dto';

@Injectable()
export class CommentService {
    constructor(
        private prisma: PrismaService
    ) { }

    async findComment(
        CommentWhereUniqueInput: Prisma.CommentWhereUniqueInput
    ): Promise<Comment | null> {
        console.log(CommentWhereUniqueInput)

        return await this.prisma.comment.findUnique({
            where: CommentWhereUniqueInput
        });
    }

    // async findCommentswithVideoId(
    //     skip?: number;
    //     take:
    // ): Promise<Comment[]> {
    //     const{ skip, take, cursor, where, orderBy } = params;
    //     return await this.prisma.comment.findMany({
    //        skip, take, cursor, where, orderBy
    //     });
    // }

    async findComments(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CommentWhereUniqueInput;
        where?: Prisma.CommentWhereInput;
        orderBy?: Prisma.CommentOrderByWithRelationInput
    }): Promise<Comment[]>{
        const { skip, take, cursor, where, orderBy } = params;

        return await this.prisma.comment.findMany({
            skip, take, cursor, where, orderBy
        });
    }

    async createComment(body: CreateCommentDTO, videoId: number): Promise<Comment>{
        return this.prisma.comment.create({
            data :{
                // user: {
                //     connect:{ id : userId }
                // },
                name: body.name,
                password: body.password,
                content: body.content,
                video: {
                    connect:{id: videoId}
                }
            }
        });
    }

    async updateComment(params: {
        where: Prisma.CommentWhereUniqueInput;
        data: Prisma.CommentUpdateInput
    }): Promise<Comment>{
        const { where, data } = params;
        return await this.prisma.comment.update({
            where, data
        });
    }

    async deleteComment(where: Prisma.CommentWhereUniqueInput): Promise<Comment>{
        return await this.prisma.comment.delete({
            where
        });
    }

}
