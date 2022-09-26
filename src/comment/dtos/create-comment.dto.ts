import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCommentDTO {

    @IsNotEmpty({message: '이름을 입력해 주세요.'})
    @ApiProperty({example: '아이디'})
    name: string;

    @IsNotEmpty({message: '비밀번호를 입력해 주세요.'})
    @ApiProperty({example: 'password'})
    password: string;

    @IsNotEmpty({message: '내용을 입력해 주세요.'})
    @ApiProperty({example: '비밀번호를 생성하였다!'})
    content: string;
}