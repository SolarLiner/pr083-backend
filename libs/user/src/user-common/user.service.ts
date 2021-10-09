import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '@pr083/mail';
import { IsNull, Repository } from 'typeorm';
import { UpdateUser } from '../dto/update-user';
import { User } from '../entities/user.entity';
import { Role } from '../role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly $users: Repository<User>,
    private readonly $mail: MailService,
  ) {}

  async create(
    username: string,
    email: string,
    password: string,
    publicName?: string,
  ): Promise<User | null> {
    const user = this.$users.create({
      username,
      email,
      publicName,
      emailVerified: false,
      roles: [Role.USER],
    });
    user.setPassword(password);

    await this.$users.insert(user);
    await this.$mail.sendEmail({
      to: {
        name: user.displayName,
        address: email,
      },
      subject: '[pr083] Verify email address',
      text: `Please verify your email address with this token: ${
        user.id
      }@${user.hashState()}`,
    });
    return user;
  }

  async activate(token: string) {
    const [id, state] = token.split('@', 2);
    const user = await this.$users.findOne({
      where: { id },
      select: ['id', 'updatedAt', 'emailVerified'],
    });
    if (user.emailVerified) return true;

    if (!user.verifyState(state)) return false;

    await this.$users.update(id, { emailVerified: true });
    return true;
  }

  isAdmin(user: User): boolean {
    return user.roles.includes(Role.ADMIN);
  }

  setAdmin(user: User) {
    if (this.isAdmin(user)) return;
    user.roles.push(Role.ADMIN);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.$users.count({ where: { id } });
    return count > 0;
  }

  async existsUser({
    email,
    username,
  }: Pick<User, 'email' | 'username'>): Promise<boolean> {
    const count = await this.$users
      .createQueryBuilder('user')
      .where({ email })
      .orWhere({ username })
      .getCount();
    return count > 0;
  }

  async existsUsername(username: string): Promise<boolean> {
    const count = await this.$users.count({ where: { username } });
    return count > 0;
  }

  async existsEmail(email: string): Promise<boolean> {
    const count = await this.$users.count({ where: { email } });
    return count > 0;
  }

  findAll(limit = 10, offset = 0, onlyLive = true): Promise<User[]> {
    return this.$users.find({
      where: onlyLive
        ? { emailVerified: true, deletedAt: IsNull() }
        : undefined,
      skip: offset,
      take: limit,
    });
  }

  findById(id: string): Promise<User | undefined> {
    return this.$users.findOne(id);
  }

  findByUsername(username: string): Promise<User | undefined> {
    return this.$users.findOne({ username });
  }

  async login(username: string, password: string): Promise<User | null> {
    const user = await this.$users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where({ username })
      .getOne();
    if (!user || !user.verifyPassword(password)) return null;

    await this.$users.update(user.id, { lastLogin: new Date() });
    return this.findById(user.id);
  }

  async update(id: string, userData: UpdateUser) {
    await this.$users.update(id, userData);
  }

  async changePassword(id: string, passwd: string) {
    const user = this.$users.create();
    user.setPassword(passwd);
    await this.$users.update(id, user);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) return;
    await this.$users.softDelete(user);
  }
}
