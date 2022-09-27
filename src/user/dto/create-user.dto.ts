import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDTO {
    
    @IsNotEmpty({message: '아이디를 입력해주세요.'})
    @ApiProperty({example: 'dkanskcj'})
    name: string;
    
    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    @ApiProperty({example: '1234'})
    password: string;


    @IsNotEmpty({ message: '비밀번호 찾는 힌트의 질문을 등록해주세요.'})
    @ApiProperty({ example: '좋아하는 색깔은?'})
    passwordHintTitle: string;

    @IsNotEmpty({ message: '비밀번호 찾는 힌트의 답변을 등록해주세요.'})
    @ApiProperty({ example: '파란색'})
    passwordHintAnswer: string;
}