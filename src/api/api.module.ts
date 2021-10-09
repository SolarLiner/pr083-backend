import { forwardRef, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from '@pr083/auth';
import { LevelModule } from '@pr083/level';
import { ApiUserModule } from '@pr083/user/api-user/api-user.module';

@Module({
  imports: [
    LevelModule,
    ApiUserModule,
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
        module: ApiUserModule,
      },
    ]),
  ],
})
export class ApiModule {}
