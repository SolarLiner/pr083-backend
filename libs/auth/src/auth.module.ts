import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@pr083/user';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import config from '@pr083/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule.forFeature(config.jwt),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(config.jwt)],
      inject: [config.jwt.KEY],
      useFactory: (config) => config,
    }),
    CaslModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
