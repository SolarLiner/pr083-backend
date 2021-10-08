import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ChangePassword {
  @ApiProperty({ minLength: 8 })
  @MinLength(8)
  password1!: string;

  @ApiProperty({ minLength: 8 })
  @MinLength(8)
  password2!: string;
}
