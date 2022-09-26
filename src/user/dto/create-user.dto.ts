import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDTO {
    
    @IsNotEmpty({message: '아이디를 입력해주세요.'})
    @ApiProperty({example: 'dkanskcj'})
    name: string;
    
    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    @ApiProperty({example: '1234'})
    password: string;
}