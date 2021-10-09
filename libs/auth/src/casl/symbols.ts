import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from './policy-handler';

export const CHECK_POLICIES_KEY = Symbol('casl:policy:check');
export const POLICIES_OPTIONAL = Symbol('casl:policiy:optional');

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
export const PoliciesOptional = () => SetMetadata(POLICIES_OPTIONAL, true);
export const PoliciesRequired = () => SetMetadata(POLICIES_OPTIONAL, false);
