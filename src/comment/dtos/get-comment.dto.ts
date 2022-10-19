import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class GetCommentDTO{
    
    // @Expose()
    // name: string;
    @Expose()
    userId: number;
    
    @Expose()
    content: string;
    
    @Expose()
    createdAt: Date;
}