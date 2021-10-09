import { JwtPayload } from '@pr083/auth';
import { PublicUser } from './entities/user.entity';

export function getUserFromRequest(
  req: Express.Request,
): PublicUser | JwtPayload {
  const { user } = req;
  if (user !== null && typeof user !== 'undefined') {
    return user as any;
  }
}
