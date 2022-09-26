import { Module } from '@nestjs/common';
import { PasswordHintService } from './password-hint.service';
import { PasswordHintController } from './password-hint.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [PasswordHintController],
  providers: [PasswordHintService, PrismaService, UserService],
  exports: [PasswordHintService]
})
export class PasswordHintModule {}
