import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  ParseBoolPipe,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  HttpCode,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
  ApiTags,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUser } from './dto/create-user';
import { UpdateUser } from './dto/update-user';
import { Roles } from './role.decorator';
import { Role } from './role.enum';
import { PublicUser } from './entities/user.entity';
import { LimitOffset } from '@pr083/rest-utils';
import { Login } from '@pr083/auth/dto/login';
import { Authorize } from '@pr083/auth/authorize.decorator';

@Controller()
@ApiTags('users')
@ApiBadRequestResponse({ description: 'Request data validation failed' })
@ApiUnauthorizedResponse({
  description: 'User does not have required permissions',
})
export class UserController {
  constructor(private readonly $users: UserService) {}

  @Post()
  @ApiCreatedResponse({
    type: PublicUser,
    description: 'Returns the newly created User object',
  })
  @ApiBadRequestResponse({ description: 'Passwords did not match' })
  async create(@Body() newUser: CreateUser) {
    if (newUser.password1 !== newUser.password2) {
      throw new BadRequestException({
        reason: 'Passwords do not match',
      });
    }
    if (await this.$users.existsUser(newUser))
      throw new BadRequestException('Username and/or email already exists');
    const user = await this.$users.create(
      newUser.username,
      newUser.email,
      newUser.password1,
      newUser.publicName,
    );
    if (!user) throw new InternalServerErrorException();
    return user.makePublic();
  }

  @Get()
  @ApiOkResponse({ type: [PublicUser], description: 'Return all active users' })
  async findAll(@Query() { limit, offset }: LimitOffset) {
    const all = await this.$users.findAll(limit, offset);
    return all.map((u) => u.makePublic());
  }

  @Get('inactive')
  @ApiOkResponse({
    type: [PublicUser],
    description: 'Return all active users, including inactive ones',
  })
  @Authorize(Role.ADMIN)
  async findInactive(@Query() { limit, offset }: LimitOffset) {
    const all = await this.$users.findAll(limit, offset, false);
    return all.map((u) => u.makePublic());
  }

  @Get('activate')
  @ApiNoContentResponse({
    description: 'User was activated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Token was incorrect or expired',
  })
  @HttpCode(201)
  async activateAccount(@Query('token') token: string): Promise<void> {
    const activationResult = await this.$users.activate(token);
    if (activationResult) return;
    throw new BadRequestException('Token was incorrect, or has expired');
  }

  @Get(':id')
  @ApiOkResponse({
    type: PublicUser,
    description: 'User matching the provided ID',
  })
  @ApiNotFoundResponse({ description: 'No matching user found with this ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.$users.findById(id);
    if (!user) throw new NotFoundException();
    return user.makePublic();
  }

  @Patch(':id')
  @Authorize(Role.ADMIN)
  @ApiNotFoundResponse({ description: 'No matching user found with this ID' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUser) {
    const exists = await this.$users.exists(id);
    if (!exists) throw new NotFoundException();

    return this.$users.update(id, updateUserDto);
  }

  @Delete(':id')
  @Authorize(Role.ADMIN)
  @ApiNotFoundResponse({ description: 'No matching user found with this ID' })
  async remove(@Param('id') id: string) {
    const exists = await this.$users.exists(id);
    if (!exists) throw new NotFoundException();

    return this.$users.remove(id);
  }
}
