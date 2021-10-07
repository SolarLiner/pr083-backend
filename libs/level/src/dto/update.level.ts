import { PartialType } from '@nestjs/swagger';
import { CreateLevel } from './create.level';

export class UpdateLevel extends PartialType(CreateLevel) {}
