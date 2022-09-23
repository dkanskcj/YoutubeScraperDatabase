import { Injectable } from '@nestjs/common';
import { Prisma, Comment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor(
        private prisma: PrismaService
    ) { }

    async Comment(
        CommentWhereUniqueInput: Prisma.CommentWhereUniqueInput
    ): Promise<Comment | null> {
        console.log(CommentWhereUniqueInput)

        return await this.prisma.comment.findUnique({
            where: CommentWhereUniqueInput
        });
    }

    async Comments(params: {
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

    async createComment(data: Prisma.CommentCreateInput): Promise<Comment>{
        return this.prisma.comment.create({
            data
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
