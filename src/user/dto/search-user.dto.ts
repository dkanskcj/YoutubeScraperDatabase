import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SearchUserDTO {
    @IsNotEmpty()
    @ApiProperty({ example: '아이디' })
    name: string;

    password?: string;

    passwordHintTitle?: string
    
    passwordHintAnswer?: string
}