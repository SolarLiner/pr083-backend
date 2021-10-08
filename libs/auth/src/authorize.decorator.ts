import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from '@pr083/user/role.decorator';
import { Role } from '@pr083/user/role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';

export const Authorize = (...roles: Role[]) =>
  applyDecorators(
    ApiBearerAuth('authorization'),
    ApiUnauthorizedResponse({
      description:
        'User was not logged in or does not have correct permissions ',
    }),
    UseGuards(JwtAuthGuard),
    Roles(...roles),
  );
