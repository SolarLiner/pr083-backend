import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@pr083/user';
import { PublicUser } from '@pr083/user/entities/user.entity';

export interface JwtPayload {
  user: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly $users: UserService,
    private readonly $jwt: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<PublicUser | null> {
    const user = await this.$users.login(username, password);
    if (!user) return null;
    return user.makePublic();
  }

  async login(user: PublicUser): Promise<string> {
    return await this.$jwt.signAsync(this.getJwtPayload(user));
  }

  private getJwtPayload({
    id,
    username,
  }: Pick<PublicUser, 'id' | 'username'>): JwtPayload {
    return { id, user: username };
  }
}
