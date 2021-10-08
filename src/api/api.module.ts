import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from '@pr083/auth';
import { LevelModule } from '@pr083/level';
import { UserModule } from '@pr083/user';

@Module({
  imports: [
    LevelModule,
    UserModule,
    AuthModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'levels',
        module: LevelModule,
      },
      {
        path: 'users',
        module: UserModule,
      },
    ]),
  ],
})
export class ApiModule {}
