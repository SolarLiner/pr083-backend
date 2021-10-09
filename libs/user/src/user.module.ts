import { Module } from '@nestjs/common';
import { ApiUserModule } from './api-user/api-user.module';
import { UserCommonModule } from './user-common/user-common.module';

@Module({
  imports: [ApiUserModule, UserCommonModule],
  exports: [ApiUserModule, UserCommonModule],
})
export class UserModule {}
