import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class FindCommentDTO {
    @IsNotEmpty()
    @ApiProperty({ example: 1})
    videoId: number;
}