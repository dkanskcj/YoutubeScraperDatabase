import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { bcrypt } from 'bcrypt'
import { bcrypjs } from 'bcryptjs'

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) {
    }

    async findUser(
        UserWhereUniqueInput: Prisma.UserWhereUniqueInput
    ): Promise<User | null> {
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
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params
        return await this.prisma.user.findMany({
            skip, take, cursor, where, orderBy
        });
    }

    async createUser(body: CreateUserDTO): Promise<User> {
        return this.prisma.user.create({
            data: {
                name: body.name,
                password: body.password,
                passwordHintAnswer: '',
                passwordHintTitle: ''
                // passwordHintTitle: body?.passwordHintTitle,
                // passwordHintAnswer: body?.passwordHintAnswer
            }
        })
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput
    }): Promise<User> {
        const { where, data } = params
        return await this.prisma.user.update({
            where, data
        });
    }

    async deleteUser(
        where: Prisma.UserWhereUniqueInput
    ): Promise<User> {
        return await this.prisma.user.delete({
            where
        })
    }

    async Encryption(text) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(text, salt)
        // const test = await bcrypt.hash()
        // const salt = await bcrypt.genSalt(10); // 기본이 10번이고 숫자가 올라갈수록 연산 시간과 보안이 높아진다.
        // const hashed = await bcrypt.hash('12345678', salt); // hashed를 데이터베이스에 저장한다.
        return hashPassword;

        // return hash;
    }

    async Decryption(text?, key?) {
        const sagasd = bcrypt.hash()
        const hash = bcrypt.hashSync(text, 10);
        // const validPassword = await bcrypt.compare(req.body.password, user.password);
        // if (!validPassword) {
        //     return res.status(400).send('이메일이나 비밀번호가 올바르지 않습니다.');
        // }
        return await bcrypt.compare(key, hash)
        // if (match) {
        //     //login
        // }
        // return match;
    }
}
