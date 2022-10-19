import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateCommentDTO {

    // @IsNotEmpty({message: '이름을 입력해 주세요.'})
    // @ApiProperty({example: '홍길동'})
    // name: string;

    // @IsNotEmpty({message: '비밀번호를 입력해 주세요.'})
    // @ApiProperty({example: '동에번쩍'})
    // password: string;


    // ?
    @IsOptional()
    // @IsNotEmpty({message: '내용을 입력해 주세요.'})
    @ApiProperty({example: '서에번쩍!'})
    content?: string;
}