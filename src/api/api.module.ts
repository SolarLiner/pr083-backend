import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { LevelModule } from '@pr083/level';

@Module({
  imports: [
    LevelModule,
    RouterModule.register([
      {
        path: 'levels',
        module: LevelModule,
      },
    ]),
  ],
})
export class ApiModule {}
