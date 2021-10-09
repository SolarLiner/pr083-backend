import { Module } from '@nestjs/common';
import { CaslModule } from '@pr083/auth/casl/casl.module';
import { UserCommonModule } from '../user-common/user-common.module';
import { UserController } from './user.controller';

@Module({
  imports: [UserCommonModule, CaslModule],
  controllers: [UserController],
})
export class ApiUserModule {}
