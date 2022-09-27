import { Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { get } from 'http';
import { CreateUserDTO } from './dto/create-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('유저')
@Controller('')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get('')
  @ApiOperation({ summary: '유저 전체 조회', description: '데이터 베이스에 있는 유저들을 모두 조회합니다.'})
  async findUsers():Promise <User[]>{
    return this.userService.findUsers({});
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 조회', description: '특정 id에 해당하는 유저를 조회합니다.'})
  async findUserById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<User>{
    return this.userService.findUser({ id });
  }

  @Get('searchUser/:name')
  @ApiOperation({ summary: '아이디로 유저를 조회합니다.', description: '아이디가 있는지 없는지 기억이 안날 때 아이디가 존재하는지 찾을 수 있습니다.'})
  async findUserByName(
    @Param('name') name: string
  ): Promise<User>{
    const users = await this.userService.findUsers({});
    let id: number = 0;
    if(!users){
      throw new NotFoundException('유저 아이디를 찾을 수 없습니다.');
    }
    for(let user of users){
      if(user.name === name){
        id = user.id
        // throw new BadRequestException('유저 아이디 존재합니다~');
      }
    }

    return this.userService.findUser({ id });
  }

  @Post(':id')
  @ApiOperation({ summary: '유저를 생성합니다.', description: '중복되지 않은 유저 아이디와 비밀번호를 입력하여 유저를 생성합니다.'})
  async createUser(
    @Body() body: CreateUserDTO
  ): Promise<User>{
    const users = await this.userService.findUsers({})
    if(!users){
      throw new NotFoundException('유저를 찾을 수 없습니다.')
    }
    else{
      for(let user of users){
        if(user.name === body.name){
          throw new BadRequestException('아이디가 중복됩니다. 다른 아이디를 생성해 주시기 바랍니다.')
        }
      }
    }
    return this.userService.createUser(body);
  }


  @Patch(':id')
  @ApiOperation({ summary: '유저를 수정합니다.', description: '유저의 비밀번호 또는 비밀번호 찾기에 대한 질문과 답변을 수정합니다.'})
  async updateUser(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateUserDTO
  ): Promise<User>{
    const user = await this.userService.findUser({ id })
    console.log('t', user)
    if(!user){
      console.log('t')
      throw new NotFoundException('비밀번호를 찾을 수 없습니다.')
    }
    if(body.password !== user.password){
      console.log('t')
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다.')
    }
    return this.userService.updateUser({
      where: { id },
      data: {
        password: body.password
      }
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: '해당 유저를 삭제합니다.', description: '특정 id의 유저를 삭제합니다.' })
  async deleteUser(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: DeleteUserDTO
  ): Promise<User>{
    const user =  await this.userService.findUser({ id });
    if(!user){
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.')
    }
    if(user.name !== body.name || user.password !== body.password){
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다.')
    }

    return this.userService.deleteUser({ id });


  }
}
