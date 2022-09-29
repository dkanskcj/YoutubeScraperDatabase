import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateVideoType } from "./typeDto/create-video.type";

export class CreateVideoDTO {
    
    @IsNotEmpty({message: '제목을 입력해 주세요.'})
    @ApiProperty({example: 'YoutubeScraper'})
    title: string;

    @IsNotEmpty({message: '썸네일을 입력해 주세요.'})
    @ApiProperty({example: 'http://localhost:4200'})
    url: string;

    // @IsNotEmpty({message: '태그를 입력해 주세요.'})
    // @ApiProperty({example: '운동'})
    // hashTag: string;

    @IsNotEmpty({message: '카테고리를 선택해 주세요.'})
    @ApiProperty({example: 'html'})
    category: string;
}