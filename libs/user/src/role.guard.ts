import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RequestUserService } from './request-user/request-user.service';
import { Role } from './role.enum';
import { ROLES_KEY } from './symbols';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestUser: RequestUserService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const user = this.requestUser.get(context.switchToHttp().getRequest());
    if (!user) return false;
    return requiredRoles.some((r) => user.roles.includes(r));
  }
}
