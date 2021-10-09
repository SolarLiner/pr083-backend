import { Injectable, PipeTransform } from '@nestjs/common';
import { JwtPayload } from '@pr083/auth';
import { PublicUser } from '../entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class FetchUserDataPipe
  implements PipeTransform<Pick<JwtPayload, 'id'>, Promise<PublicUser>>
{
  constructor(private readonly $users: UserService) {}

  async transform({ id }: JwtPayload): Promise<PublicUser> {
    return await this.$users.findById(id);
  }
}
