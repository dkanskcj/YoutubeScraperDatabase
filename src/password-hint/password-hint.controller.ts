import { Controller, Get, Param, Post, Patch, BadRequestException, NotFoundException, Delete, ParseIntPipe, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { passwordHint, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CreateHintDTO } from './dto/create-hint.dto';
import { UpdateHintDTO } from './dto/update-hint.dto';
import { PasswordHintService } from './password-hint.service';

@ApiTags('비밀번호 답변 힌트')
@Controller('')
export class PasswordHintController {
  constructor(
    private readonly passwordHintService: PasswordHintService,
    private readonly userService: UserService
  ) { }

  @Get('search/:id')
  @ApiOperation({ summary: '특정 유저의 비밀번호 힌트 조회', description: '해당 유저의 비밀번호 힌트를 조회합니다.' })
  async findHintByUserId(
    @Param('id', new ParseIntPipe()) userId: number
  ): Promise<passwordHint[]> {
    const user = this.userService.findUser({ id: userId });

    if (!user) {
      throw new NotFoundException('해당 유저를 조회할 수 없습니다.')
    }
    return this.passwordHintService.findHints({
      where: {
        OR: [
          { userId: userId }
        ]
      }
    });
  }
  

  @Post('find/:userId')
  @ApiOperation({ summary: '특정 유저의 비밀번호를 찾습니다.', description: '질분 찾기 답변과 힌트로 입력한 답변이 일치한다면 비밀번호를 알려줍니다.'})
  async findPasswordByHint(
    @Param('userId', new ParseIntPipe()) id: number,
    @Body() body: CreateHintDTO
  ): Promise<User>{
    const user = await this.userService.findUser({ id });
    // 유저가 존재한다면 사용
    if(!user){
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.')
    }
    else{
      const hints = await this.passwordHintService.findHints({})
      if(!hints){
        throw new NotFoundException('질문과 답변을 만들지 않은 사용자입니다.')
      }
      else{
        for(let hint of hints){
          if(hint.userId === user.id){
            if(hint.authAnswer !== body.authAnswer){
              throw new BadRequestException('잘못된 답변입니다. 다시 입력해 주시기 바랍니다.')
            }
            if(!hint.id && user.id === hint.userId){
              throw new NotFoundException(user, '질문과 답변을 생성하지 않은 사용자입니다.')
            }
          }
        }
      }
    }
     return this.userService.findUser({ id });
  }

  @Post(':userId')
  @ApiOperation({ summary: '해당 유저에게 비밀번호 질문 답변을 생성합니다.', description: '해당 유저가 원하는 질문과 답변을 1개만 작성하여 생성합니다.' })
  async createHintWithUserId(
    @Param('userId', new ParseIntPipe()) id: number,
    @Body() body: CreateHintDTO
  ): Promise<passwordHint> {
    const user = await this.userService.findUser({ id });
    if (!user) {
      throw new NotFoundException('해당 유저를 조회할 수 없습니다.')
    }
    const hint = await this.passwordHintService.findHints({
      where: {
        OR: [
          { userId: id }
        ]
      }
    });
    if(hint.length > 0){
      throw new BadRequestException('이미 질문이 존재합니다.')
    }
    return this.passwordHintService.createHint(id, body);
  }

  @Patch(':userId/hint:id')
  @ApiOperation({ summary: '유저 비밀번호 수정 질의응답을 수정합니다.', description: '해당 유저의 질문과 답변을 수정할 수 있습니다.' })
  async updateHintWithUserId(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateHintDTO
  ): Promise<passwordHint> {
    // 유저 찾기
    const user = await this.userService.findUser({ id: userId })
    if (!user) {
      throw new NotFoundException('해당 유저를 조회할 수 없습니다.')
    }
    if (user.password !== body.password || user.name !== body.name) {
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다.')
    }
    return this.passwordHintService.updateHint({
      where: { id },
      data: {
        authTitle: body.authTitle,
        authAnswer: body.authAnswer,
      }
    });
  }


}
