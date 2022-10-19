import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

@Exclude()
export class LoginUserDTO {
    @ApiProperty({example: '아이디'})
    @Expose()
    name: string;

    @ApiProperty({example: '비밀번호'})
    @Expose()
    password: string;
}