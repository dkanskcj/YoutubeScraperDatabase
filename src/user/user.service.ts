import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
        ) {
    }

    async findUser(
        UserWhereUniqueInput: Prisma.UserWhereUniqueInput
    ): Promise<User | null>{
        return await this.prisma.user.findUnique({
            where: UserWhereUniqueInput
        });
    }

    async findUsers(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput
    }): Promise<User[]>{
        const { skip, take, cursor, where, orderBy } = params
        return await this.prisma.user.findMany({
            skip, take, cursor, where, orderBy
        });
    }

    async createUser(body: CreateUserDTO): Promise<User>{
        return this.prisma.user.create({
            data : {
                name: body.name,
                password: body.password
            }
        })
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput
    }): Promise<User>{
        const { where, data } = params
        return await this.prisma.user.update({
            where, data
        });
    }

    async deleteUser(
        where: Prisma.UserWhereUniqueInput
    ): Promise<User>{
        return await this.prisma.user.delete({
            where
        })
    }
}
