import { PartialType } from '@nestjs/swagger';
import { CreateUser } from './create-user';

export class UpdateUser extends PartialType(CreateUser) { }
