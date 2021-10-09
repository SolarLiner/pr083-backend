import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '@pr083/mail';
import { User } from '../entities/user.entity';
import { FetchUserDataPipe } from './fetch-user-data.pipe';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule.withTestAccount('pr083 Beam <noreply@codeanon.org>'),
  ],
  providers: [UserService, FetchUserDataPipe],
  exports: [UserService, FetchUserDataPipe],
})
export class UserCommonModule {}
