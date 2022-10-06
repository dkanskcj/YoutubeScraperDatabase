import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateVideoDTO {
    
    @IsNotEmpty({message: '제목을 입력해 주세요.'})
    @ApiProperty({example: 'YoutubeScraper'})
    title: string;

    @IsNotEmpty({message: '카테고리를 선택해 주세요.'})
    @ApiProperty({example: 'html'})
    category: string;
}