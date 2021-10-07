import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from '@pr083/level/entities/level.entity';
import { LevelController } from '@pr083/level/level.controller';
import { LevelService } from './level.service';

@Module({
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
  imports: [TypeOrmModule.forFeature([Level])],
})
export class LevelModule {}
