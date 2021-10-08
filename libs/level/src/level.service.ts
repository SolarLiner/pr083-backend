import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Level,
  PublicLevel,
  TreeLevel,
} from '@pr083/level/entities/level.entity';
import { plainToClass } from 'class-transformer';
import * as slug from 'slug';
import { ObjectLiteral, TreeRepository } from 'typeorm';
import { CreateLevel } from './dto/create.level';
import { UpdateLevel } from './dto/update.level';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level) private readonly $levels: TreeRepository<Level>,
  ) {}

  propertyMap(): ObjectLiteral {
    return this.$levels.metadata.propertiesMap;
  }

  async create({
    name,
    oxygen,
    points,
    parent,
  }: CreateLevel): Promise<Level | null> {
    const level = this.$levels.create({
      name,
      slug: slug(name),
      oxygen,
      points,
      parent: parent ? { slug: parent } : undefined,
    });

    const res = await this.$levels.insert(level);
    if (res.identifiers.length > 0) return level;
    return null;
  }

  async findAll(limit = 10, offset = 0): Promise<Level[]> {
    return this.$levels.find({ skip: offset, take: limit });
  }

  async getTree(): Promise<Level> {
    return this.$levels.findTrees().then(first);
  }

  async subtree(id: string): Promise<Level | null> {
    const subroot = await this.findOne(id);
    if (!subroot) return null;

    const results = await this.$levels.findDescendantsTree(subroot);
    return plainToClass(Level, results);
  }

  async ancestorsOf(level: Level): Promise<Level[]> {
    const results = await this.$levels.findAncestors(level);
    return plainToClass(Level, results);
  }

  async findOne(id: string): Promise<Level | undefined> {
    const result = await this.$levels.findOne(id);
    return plainToClass(Level, result);
  }

  async update(
    id: string,
    { name, oxygen, points, parent }: UpdateLevel,
  ): Promise<Level | null> {
    const count = await this.$levels.count({ id });
    if (count === 0) return null;
    const level = await this.$levels.update(
      id,
      this.$levels.create({
        name,
        slug: name ? slug(name) : undefined,
        oxygen,
        points,
        parent: parent ? this.$levels.create({ id: parent }) : undefined,
      }),
    );
    return plainToClass(Level, level);
  }

  async remove(id: string) {
    await this.$levels.delete(id);
  }

  async verifySolve(id: string, entry: string): Promise<boolean | null> {
    const level = await this.findOne(id);
    if (level) return level.verifySolve(entry);
    return null;
  }
}

function first<T>(value: Array<T>): T | undefined {
  return value[0];
}
