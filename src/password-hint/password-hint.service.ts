import { Body, Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { passwordHint, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHintDTO } from './dto/create-hint.dto';

@Injectable()
export class PasswordHintService {
    constructor(private prisma: PrismaService) { }


    async findHint(
        HintWhereUniqueInput: Prisma.passwordHintWhereUniqueInput
    ): Promise<passwordHint | null> {
        return await this.prisma.passwordHint.findUnique({
            where: HintWhereUniqueInput
        });
    }

    async findHints(
        params: {
            skip?: number,
            take?: number,
            cursor?: Prisma.passwordHintWhereUniqueInput,
            where?: Prisma.passwordHintWhereInput,
            orderBy?: Prisma.passwordHintOrderByWithRelationInput
        }
    ): Promise<passwordHint[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return await this.prisma.passwordHint.findMany({
            skip, take, cursor, where, orderBy
        });
    }

    async createHint(userId: number, body: CreateHintDTO
    ): Promise<passwordHint> {
        return await this.prisma.passwordHint.create({
            data: {
                authTitle: body.authTitle,
                authAnswer: body.authAnswer,
                user: {
                    connect: { id: userId }
                }
            }
        });
    }

    async updateHint(params: {
        where: Prisma.passwordHintWhereUniqueInput,
        data: Prisma.passwordHintUpdateInput
    }): Promise<passwordHint> {
        const { where, data } = params
        return await this.prisma.passwordHint.update({
            where, data
        });
    }

    async deleteHint(where: Prisma.passwordHintWhereUniqueInput): Promise<passwordHint> {
        return await this.prisma.passwordHint.delete({
            where
        });
    }
}
