import { OmitType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Point } from '@pr083/level/point.class';
import { PublicUser, User } from '@pr083/user/entities/user.entity';
import { Type, plainToClass } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
  ManyToMany,
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

  @ManyToMany(() => User, (u) => u.solvedLevels, { onDelete: 'RESTRICT' })
  @ApiProperty({
    type: () => [PublicUser],
    description: 'Users having solved this level',
  })
  solvedBy!: PublicUser[];

  verifySolve(entry: string): boolean {
    // TODO: Actual algorithm
    return false;
  }

  makePublic(): PublicLevel {
    const { parent, children, ...level } = this;
    return plainToClass(PublicLevel, level);
  }

  makeTree(): TreeLevel {
    const { parent, children, ...level } = this;
    return plainToClass(TreeLevel, {
      ...level,
      children: children.map((l) => l.makeTree()),
    });
  }
}

export class PublicLevel extends OmitType(Level, ['parent', 'children']) {}

export class TreeLevel extends PublicLevel {
  @ApiProperty({
    type: [TreeLevel],
    description: 'The children levels of this level',
  })
  children!: TreeLevel[];
}
