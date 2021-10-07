import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Point } from '@pr083/level/point.class';

export class CreateLevel {
  @ApiProperty()
  name!: string;
  @ApiPropertyOptional({ type: 'string' })
  parent?: string;
  @ApiProperty()
  oxygen!: number;
  @ApiProperty({ isArray: true, type: Point })
  points!: Point[];
}
