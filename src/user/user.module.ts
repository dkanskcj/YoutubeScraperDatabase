import { Module } from '@nestjs/common';
import { CryptoSerivce } from 'src/crypto/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CryptoSerivce],
  exports: [UserService]
})
export class UserModule {}
