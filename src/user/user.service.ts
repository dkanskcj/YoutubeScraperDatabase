import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {

    }

    async User(
        UserWhereUniqueInput: Prisma.UserWhereUniqueInput
    ): Promise<User | null> {
        console.log('UserWhereUniqueInput: ', UserWhereUniqueInput)
        
        return await this.prisma.user.findUnique({
            where: UserWhereUniqueInput
        })
    }

    async Users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return await this.prisma.user.findMany({
            skip, take, cursor, where, orderBy
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User>{
        return await this.prisma.user.create({
            data
        })
    }


    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        return await this.prisma.user.update({
            data, where
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User>{
        return await this.prisma.user.delete({
            where
        });
    }
}
