import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class deleteCommentDTO {
  
    @IsNotEmpty({message: '아이디를 입력해 주세요.'})
    @ApiProperty({example: 'dkanskcj'})
    name: string;
    
    @IsNotEmpty({message: '비밀번호를 입력해 주세요.'})
    @ApiProperty({example: '1234'})
    password: string;
}