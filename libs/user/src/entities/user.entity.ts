import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../role.enum';
import { OmitType, ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { PublicLevel, Level } from '@pr083/level/entities/level.entity';

const ROUNDS = 8;

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'User ID' })
  id!: string;

  @Column({ unique: true, length: 50 })
  @ApiProperty({ description: 'Unique username', maxLength: 50 })
  username!: string;

  @Column({ unique: true, length: 255 })
  @ApiProperty({ description: 'Unique email', maxLength: 255 })
  email!: string;

  @Column({ nullable: true, length: 50 })
  @ApiProperty({
    nullable: true,
    description: 'Optional public display name',
    maxLength: 50,
  })
  publicName?: string;

  @ManyToMany(() => Level, (l) => l.solvedBy, { onDelete: 'RESTRICT' })
  @ApiProperty({
    type: () => [PublicLevel],
    description: 'Levels solved by this user',
  })
  solvedLevels!: PublicLevel[];

  @Column({ type: 'jsonb' })
  @ApiProperty({
    description: 'Roles associated to the user',
    enum: Role,
    isArray: true,
    minLength: 1,
  })
  roles!: Role[];

  @CreateDateColumn()
  @ApiProperty({ description: 'User creation date' })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'User last modification date' })
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  @ApiProperty({ nullable: true, description: 'Date of last login' })
  lastLogin?: Date;

  @Column({ default: false })
  emailVerified!: boolean;

  @ApiProperty({ readOnly: true, description: 'Is user active' })
  get isActive(): boolean {
    const softDeleted = this.deletedAt
      ? Date.now() > this.deletedAt.valueOf()
      : false;
    return !softDeleted && this.emailVerified;
  }

  @Column({ select: false, length: 60, type: 'char' })
  passwordHash!: string;

  @ApiProperty({
    readOnly: true,
    type: String,
    description:
      "User's computed display name (username if public name isn't specified",
  })
  get displayName(): string {
    return this.publicName ?? this.username;
  }

  setPassword(pwd: string) {
    const salt = bcrypt.genSaltSync(ROUNDS);
    this.passwordHash = bcrypt.hashSync(pwd, salt);
  }

  verifyPassword(actualPwd: string): boolean {
    return bcrypt.compareSync(actualPwd, this.passwordHash);
  }

  makePublic(): PublicUser {
    const { emailVerified, passwordHash, ...user } = this;
    return plainToClass(PublicUser, user);
  }

  hashState(): string {
    return bcrypt.hashSync(this.hashInner(), 1);
  }

  verifyState(expected: string): boolean {
    return bcrypt.compareSync(this.hashInner(), expected);
  }

  private hashInner(): string {
    const inner = JSON.stringify({
      i: this.id,
      u: this.updatedAt,
      v: this.emailVerified,
    });
    new Logger(`${User.name}:hash`).log(`Hash inner: ${inner}`);
    return inner;
  }
}

export class PublicUser extends OmitType(User, [
  'passwordHash',
  'emailVerified',
]) {}
