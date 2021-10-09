import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '@pr083/auth/casl/casl.module';
import { Level } from '@pr083/level/entities/level.entity';
import { LevelController } from '@pr083/level/level.controller';
import { UserCommonModule } from '@pr083/user/user-common/user-common.module';
import { LevelService } from './level.service';

@Module({
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
  imports: [TypeOrmModule.forFeature([Level]), UserCommonModule, CaslModule],
})
export class LevelModule {}
