import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class RequestUserService {
    get(req: Express.Request): User | null {
        if ("user" in req) return (req as any).user;
        return null;
    }
}
