import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

@Exclude()
export class CreateCommentDTO {

    // @IsNotEmpty({message: '내용을 입력해 주세요.'})
    // @ApiProperty({example: '댓글을 생성하였다!'})
    @Expose()
    content: string;
}