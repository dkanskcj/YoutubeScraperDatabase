import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { PasswordHintModule } from './password-hint/password-hint.module';

const routes: Routes = [
    { path: 'video', module: VideoModule },
    { path: 'comment', module: CommentModule },
    { path: 'user', module: UserModule},
    { path: 'findPassword', module: PasswordHintModule}
]

@Module({
    imports: [RouterModule.register(routes), VideoModule, CommentModule, UserModule, PasswordHintModule],
    exports: [RouterModule]
})
export class AppRoutingModule { }
