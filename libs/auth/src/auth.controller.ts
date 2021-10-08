import { Get, Post, Controller, UseGuards, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Login } from './dto/login';
import { PublicUser } from '@pr083/user/entities/user.entity';
import { User } from '@pr083/user/user.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService, JwtPayload } from './auth.service';
import { plainToClass } from 'class-transformer';
import { Authorize } from './authorize.decorator';
import { Role } from '@pr083/user/role.enum';
import { UserService } from '@pr083/user';

class LoggedInUser extends PublicUser {
  token: string;
}

@ApiTags('auth')
@ApiBadRequestResponse({ description: 'Request data validation failed' })
@Controller()
export class AuthController {
  constructor(
    private readonly $auth: AuthService,
    private readonly $users: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: Login, description: 'Login credentials' })
  @ApiOkResponse({
    type: LoggedInUser,
    description:
      'User details, along with a `token` value that contains the Bearer token to use on authenticated requests',
  })
  @ApiUnauthorizedResponse({
    description: 'Username and/or password did not match',
  })
  @HttpCode(200)
  async login(@User() user: PublicUser): Promise<LoggedInUser> {
    const token = await this.$auth.login(user);
    return plainToClass(LoggedInUser, { ...user, token });
  }

  @Get('profile')
  @ApiOkResponse({
    type: PublicUser,
    description: 'Currently logged in user details',
  })
  @Authorize(Role.USER)
  @HttpCode(200)
  async profile(@User() user: JwtPayload): Promise<PublicUser> {
    return this.$users.findById(user.id);
  }
}
