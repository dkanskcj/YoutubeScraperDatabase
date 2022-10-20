import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { UserDTO } from "src/user/dto/user.dto";

@Exclude()
export class CommentDTO {
    
    @ApiProperty()
    @Expose()
    id: number;
    
    @ApiProperty()
    @Expose()
    content: string;

    @ApiProperty()
    @Expose()
    @Type(() => UserDTO)
    user: UserDTO;
    
    @ApiProperty()
    @Expose()
    createdAt: Date;
    
    @ApiProperty()
    @Expose()
    updatedAt: Date;
}