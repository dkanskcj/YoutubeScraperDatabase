import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';

const routes : Routes = [
    {path: 'video', module: VideoModule},
    {path: 'comment', module: CommentModule}
]

@Module({
    imports: [RouterModule.register(routes),  VideoModule, CommentModule],
    exports:[RouterModule]
})
export class AppRoutingModule {}
