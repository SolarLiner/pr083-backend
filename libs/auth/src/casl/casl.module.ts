import { Module } from '@nestjs/common';
import { UserCommonModule } from '@pr083/user/user-common/user-common.module';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PoliciesGuard } from './policies-guard';

@Module({
  imports: [UserCommonModule],
  providers: [CaslAbilityFactory, PoliciesGuard],
  exports: [CaslAbilityFactory, PoliciesGuard],
})
export class CaslModule {}
