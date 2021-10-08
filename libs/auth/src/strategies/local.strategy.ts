import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { PublicUser } from '@pr083/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly $auth: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<PublicUser> {
    const user = await this.$auth.validateUser(username, password);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
