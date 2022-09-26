import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateHintDTO {
    
    @IsNotEmpty({ message: '아이디를 입력해 주세요.'})
    @ApiProperty({ example: '아이디'})
    name: string;
    
    @IsNotEmpty({ message: '비밀번호를 입력해 주세요'})
    @ApiProperty({ example: '1234'})
    password: string;

    @IsNotEmpty({ message: '질문이 비었습니다.'})
    @ApiProperty({ example: '좋아하는 색상은?'})
    authTitle: string;

    @IsNotEmpty({ message: '질문에 대한 답변이 비어있습니다.'})
    @ApiProperty({ example: '파란색'})
    authAnswer: string;
}