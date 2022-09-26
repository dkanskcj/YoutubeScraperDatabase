import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateHintDTO {
    

    @IsNotEmpty({ message: '질문이 비었습니다.'})
    @ApiProperty({ example: '좋아하는 색상은?'})
    authTitle: string;

    @IsNotEmpty({ message: '질문에 대한 답변이 비어있습니다.'})
    @ApiProperty({ example: '파란색'})
    authAnswer: string;
}