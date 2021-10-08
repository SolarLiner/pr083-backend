import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class Login {
  @ApiProperty({ maxLength: 50 })
  @MaxLength(50)
  username!: string;

  @ApiProperty({ minLength: 8 })
  @MinLength(8)
  password!: string;
}
