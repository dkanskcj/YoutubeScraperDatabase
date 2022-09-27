import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';

const routes: Routes = [
    { path: 'video', module: VideoModule },
    { path: 'comment', module: CommentModule },
    { path: 'user', module: UserModule},
]

@Module({
    imports: [RouterModule.register(routes), VideoModule, CommentModule, UserModule],
    exports: [RouterModule]
})
export class AppRoutingModule { }
