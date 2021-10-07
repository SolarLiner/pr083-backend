import { ApiProperty } from '@nestjs/swagger';

export class Point {
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}
