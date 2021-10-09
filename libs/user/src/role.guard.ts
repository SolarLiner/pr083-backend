import { ModuleRef } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './role.enum';
import { ROLES_KEY } from './symbols';
import { getUserFromRequest } from './user-utils';
import { LruCache } from '@pr083/rest-utils/cache.decorator';
import { UserService } from './user-common/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const user = getUserFromRequest(context.switchToHttp().getRequest());
    if (!user) return false;
    const roles =
      'roles' in user
        ? user.roles
        : (await (await this.getUserService()).findById(user.id)).roles;
    return requiredRoles.some((r) => roles.includes(r));
  }

  @LruCache()
  private getUserService(): Promise<UserService> {
    return this.moduleRef.resolve(UserService);
  }
}
