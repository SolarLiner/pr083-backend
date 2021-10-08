import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RequestUserService } from './request-user/request-user.service';

@Injectable()
export class RequestUserPipe implements PipeTransform<Express.Request, User | null> {
  constructor(private readonly requestUser: RequestUserService) { }

  transform(req: Express.Request): User | null {
    return this.requestUser.get(req);
  }

}
