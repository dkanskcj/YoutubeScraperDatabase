import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { ContentService } from './content/content.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserService, ContentService, PrismaService],
})
export class AppModule { }
