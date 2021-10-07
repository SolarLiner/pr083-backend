import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Solve } from '@pr083/level/dto/solve';
import { BaseLevel, Level, TreeLevel } from '@pr083/level/entities/level.entity';
import { LimitOffset } from '@pr083/rest-utils';
import { CreateLevel } from './dto/create.level';
import { UpdateLevel } from './dto/update.level';
import { LevelService } from './level.service';

@Controller()
@ApiTags('levels')
@ApiBadRequestResponse({ description: "Request body was not valid" })
export class LevelController {
  constructor(private readonly $level: LevelService) { }

  /**
   * Create a Level record by supplying its name, oxygen budget and list of points.
   * @param createLevel Level data
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The level has been successfully created',
  })
  @ApiConflictResponse({
    description: 'The database rejected the new Level record',
  })
  @ApiResponse({
    status: 500,
    description:
      "The server couldn't persist the Level record due to an unknown error",
  })
  async create(@Body() createLevel: CreateLevel) {
    const success = await this.$level.create(createLevel);
    if (success) return;
    throw new ConflictException();
  }

  /**
   * Find all trees, optionally paginated with `limit` and `offset`.
   * @param limit Limit the number of records returned
   * @param offset Offset the start in the records list
   * @param include If present, only include these keys in the records output
   */
  @Get()
  @ApiQuery({ type: LimitOffset, explode: true })
  @ApiOkResponse({ type: [BaseLevel] })
  findAll(@Query() { limit, offset }: LimitOffset): Promise<Level[]> {
    return this.$level.findAll(limit, offset);
  }

  /**
   * Get the nested tree structure of levels
   */
  @Get('tree')
  @ApiOkResponse({ type: TreeLevel, description: 'Fully realized tree of levels' })
  @ApiNotFoundResponse({ description: 'No levels have been created yet' })
  async tree(): Promise<Level> {
    const result = await this.$level.getTree();
    if (!result) throw new NotFoundException();
    return result;
  }

  /**
   * Return the fully realized subtree starting from the level at the given ID
   * @param id ID of the Level to start the subtree from
   */
  @Get('tree/:id')
  @ApiParam({ name: 'id', type: String, description: 'Level ID' })
  @ApiOkResponse({ type: TreeLevel, description: 'Realized subtree' })
  @ApiNotFoundResponse({ description: 'Subroot level was not found' })
  async subtree(@Param('id') id: string): Promise<Level> {
    const result = await this.$level.subtree(id);
    if (!result) throw new NotFoundException();
    return result;
  }

  /**
   * Get a Level record by its ID
   * @param id ID to match against
   * @returns the Level record matching the ID
   * @throws NotFoundException if the ID doesn't match
   */
  @Get(':id')
  @ApiOkResponse({ type: BaseLevel })
  @ApiNotFoundResponse()
  async findOne(@Param('id') id: string): Promise<Level> {
    const result = await this.$level.findOne(id);
    if (result) return result;
    else throw new NotFoundException();
  }

  /**
   * Update the Level record matching the provided ID
   * @param updateLevel Update data
   * @param id Level ID to update
   */
  @Patch(':id')
  @ApiOkResponse({ type: BaseLevel })
  @ApiNotFoundResponse()
  async update(@Body() updateLevel: UpdateLevel, @Param('id') id: string) {
    const result = await this.$level.update(id, updateLevel);
    if (result) return result;
    throw new NotFoundException();
  }

  /**
   * Delete a Level record from persistence
   * @param id Level ID of the record to remove
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.$level.remove(id);
  }

  /**
   * Submit a solve for verification
   * @param levelId Level ID to solve against
   * @param entry Solve entry
   * @return boolean Whether the solve is acceptable
   */
  @Post('solve')
  @ApiOkResponse({ description: 'The verified solve', type: Boolean })
  @ApiNotFoundResponse({
    description: 'The level ID did not match any existing records',
  })
  async verifySolve(@Body() { levelId, entry }: Solve): Promise<boolean> {
    const res = await this.$level.verifySolve(levelId, entry);
    if (res === null) throw new NotFoundException();
    return res;
  }
}
