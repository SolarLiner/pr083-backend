import { OmitType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Point } from '@pr083/level/point.class';
import { Type } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Tree('nested-set')
export class Level {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column({ length: 50 })
  @ApiProperty()
  name!: string;

  @Column({ unique: true, length: 50 })
  @ApiProperty()
  slug!: string;

  @Column()
  @ApiProperty()
  oxygen!: number;

  @Column({ type: 'jsonb' })
  @ApiProperty({ type: [Point] })
  @Type(() => Point)
  points!: Point[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;

  @TreeParent()
  @ApiPropertyOptional({ type: () => Level })
  @Type(() => Level)
  parent?: Level;

  @TreeChildren()
  @ApiProperty({ type: () => [Level] })
  @Type(() => Level)
  children!: Level[];

  verifySolve(entry: string): boolean {
    // TODO: Actual algorithm
    return false;
  }
}

export class BaseLevel extends OmitType(Level, ["parent", "children"]) { }
export class TreeLevel extends OmitType(Level, ["parent"]) { }