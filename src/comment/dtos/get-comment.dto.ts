import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class GetCommentDTO{
    
    @Expose()
    name: string;
    
    @Expose()
    createdAt: Date;
    
    @Expose()
    content: string;
}