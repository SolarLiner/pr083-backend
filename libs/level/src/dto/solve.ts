import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsUUID } from 'class-validator';

/**
 * Probe movement solve sent by the client to request success
 */
export class Solve {
  /**
   * Level ID this solves against
   */
  @ApiProperty()
  @IsUUID('4')
  levelId!: string;
  /**
   * Numeric list of movement entries
   */
  @ApiProperty()
  @IsNumberString({ no_symbols: true })
  entry!: string;
}
