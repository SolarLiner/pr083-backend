import { ApiProperty } from '@nestjs/swagger';

export class LimitOffset {
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Limit the number of records returned',
  })
  limit = 10;
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Offset the start of the returned records',
  })
  offset = 0;
}
