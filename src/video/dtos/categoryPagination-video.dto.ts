import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CategoryPaginationVideo {
    @IsNotEmpty({message: '카테고리를 입력해 주세요.'})
    @ApiProperty({example: 'HTML'})
    category: string;
}