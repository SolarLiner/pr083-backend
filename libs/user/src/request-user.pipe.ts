import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { JwtPayload } from '@pr083/auth';
import { PublicUser, User } from './entities/user.entity';
import { getUserFromRequest } from './user-utils';

@Injectable()
export class RequestUserPipe
  implements PipeTransform<Express.Request, PublicUser | JwtPayload | null>
{
  transform(req: Express.Request): PublicUser | JwtPayload | null {
    return getUserFromRequest(req) ?? null;
  }
}
