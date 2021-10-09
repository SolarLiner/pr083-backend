import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Authorize, AuthorizeOptional } from '@pr083/auth/authorize.decorator';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '@pr083/auth/casl/abilities.decorator';
import { LimitOffset } from '@pr083/rest-utils';
import { CreateUser } from '../dto/create-user';
import { UpdateUser } from '../dto/update-user';
import { User, PublicUser } from '../entities/user.entity';
import { UserService } from '../user-common/user.service';

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
  @Authorize(CanCreate(User))
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
  @AuthorizeOptional(CanRead(PublicUser))
  async findAll(@Query() { limit, offset }: LimitOffset) {
    const all = await this.$users.findAll(limit, offset);
    return all.map((u) => u.makePublic());
  }

  @Get('inactive')
  @ApiOkResponse({
    type: [PublicUser],
    description: 'Return all active users, including inactive ones',
  })
  @Authorize(CanRead(User))
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
  @AuthorizeOptional(CanRead(PublicUser))
  async findOne(@Param('id') id: string) {
    const user = await this.$users.findById(id);
    if (!user) throw new NotFoundException();
    return user.makePublic();
  }

  @Patch(':id')
  @Authorize(CanUpdate(PublicUser))
  @ApiNotFoundResponse({ description: 'No matching user found with this ID' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUser) {
    const exists = await this.$users.exists(id);
    if (!exists) throw new NotFoundException();

    return this.$users.update(id, updateUserDto);
  }

  @Delete(':id')
  @Authorize(CanDelete(PublicUser))
  @ApiNotFoundResponse({ description: 'No matching user found with this ID' })
  async remove(@Param('id') id: string) {
    const exists = await this.$users.exists(id);
    if (!exists) throw new NotFoundException();

    return this.$users.remove(id);
  }
}
