import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateUserDTO {
    
    @IsNotEmpty({ message: '비밀번호를 입력해 주시기 바랍니다.' })
    @ApiProperty({ example: '1234'})
    password: string;

    @ApiProperty({ example: '좋아하는 색깔은?'})
    passwordHintTitle?: string;

    @ApiProperty({ example: '파란색'})
    passwordHintAnswer?: string;
}