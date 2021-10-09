import { Reflector, ModuleRef } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory';
import { PolicyHandler } from './policy-handler';
import { CHECK_POLICIES_KEY, POLICIES_OPTIONAL } from './symbols';
import { JwtPayload } from '../auth.service';
import { UserService } from '@pr083/user';
import { LruCache } from '@pr083/rest-utils/cache.decorator';
import { getUserFromRequest } from '@pr083/user/user-utils';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: CaslAbilityFactory,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const optional =
      this.reflector.get(POLICIES_OPTIONAL, context.getHandler()) ?? false;
    const handlers =
      this.reflector.getAllAndMerge<PolicyHandler[]>(CHECK_POLICIES_KEY, [
        context.getClass(),
        context.getHandler(),
      ]) ?? [];

    const { id } = getUserFromRequest(context.switchToHttp().getRequest());

    let ability: AppAbility;
    if (typeof id === 'undefined' || id === null) {
      if (!optional) throw new UnauthorizedException();
      ability = this.abilityFactory.createForPublic();
    } else {
      ability =
        id === null || typeof id === 'undefined'
          ? this.abilityFactory.createForUser(
              await this.getUserService().then(($users) => $users.findById(id)),
            )
          : this.abilityFactory.createForPublic();
    }
    return handlers.every((h) => this.execHandler(h, ability));
  }

  private execHandler(handler: PolicyHandler, ability: AppAbility): unknown {
    if (typeof handler === 'function') return handler(ability);
    return handler.handle(ability);
  }

  @LruCache()
  private getUserService(): Promise<UserService> {
    return this.moduleRef.resolve(UserService);
  }
}
