import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { LevelModule } from '@pr083/level';
import { UserModule } from '@pr083/user';

@Module({
  imports: [
    LevelModule,
    UserModule,
    RouterModule.register([
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
