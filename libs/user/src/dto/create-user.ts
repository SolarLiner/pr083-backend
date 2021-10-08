import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ChangePassword } from './change-password';

export class CreateUser extends ChangePassword {
  @ApiProperty({ maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @MaxLength(50)
  username!: string;

  @ApiProperty({ required: false, maxLength: 50 })
  @MaxLength(50)
  @IsOptional()
  publicName?: string;
}
