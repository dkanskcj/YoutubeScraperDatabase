import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBodyCommentDTO {

    @IsNotEmpty({message: '이름을 입력해 주세요.'})
    @ApiProperty({example: 'dkanskcj'})
    name: string;

    @IsNotEmpty({message: '비밀번호를 입력해 주세요.'})
    @ApiProperty({example: '1234'})
    password: string;

    @IsNotEmpty({message: '내용을 입력해 주세요.'})
    @ApiProperty({example: '댓글을 생성하였다!'})
    content: string;
}