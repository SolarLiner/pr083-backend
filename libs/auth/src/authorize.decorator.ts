import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PoliciesGuard as PoliciesGuard } from './casl/policies-guard';
import { PolicyHandler } from './casl/policy-handler';
import {
  CheckPolicies,
  PoliciesOptional,
  PoliciesRequired,
} from './casl/symbols';
import { JwtAuthGuard } from './jwt-auth.guard';

export const Authorize = (...handlers: PolicyHandler[]) =>
  applyDecorators(
    ApiBearerAuth('authorization'),
    ApiUnauthorizedResponse({
      description:
        'User was not logged in or does not have correct permissions ',
    }),
    AuthorizeOptional(...handlers),
    PoliciesRequired(),
  );
export const AuthorizeOptional = (...handlers: PolicyHandler[]) =>
  applyDecorators(
    PoliciesOptional(),
    UseGuards(JwtAuthGuard),
    UseGuards(PoliciesGuard),
    CheckPolicies(...handlers),
  );
