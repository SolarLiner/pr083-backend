import { Module } from '@nestjs/common';
import { MailModule } from '@pr083/mail';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RequestUserService } from './request-user/request-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule.withTestAccount('pr083 Beam <noreply@pr083.com>'),
  ],
  controllers: [UserController],
  providers: [UserService, RequestUserService],
  exports: [UserService],
})
export class UserModule {}
