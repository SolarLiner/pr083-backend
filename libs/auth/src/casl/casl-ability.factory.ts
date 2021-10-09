import {
  Ability,
  AbilityClass,
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Solve } from '@pr083/level/dto/solve';
import { Level } from '@pr083/level/entities/level.entity';
import { LruCache } from '@pr083/rest-utils/cache.decorator';
import { PublicUser, User } from '@pr083/user/entities/user.entity';
import { Role } from '@pr083/user/role.enum';
import { Action } from '../action.enum';

export type Subjects =
  | InferSubjects<typeof PublicUser | typeof User | typeof Level | typeof Solve>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  @LruCache()
  createForUser(user: PublicUser) {
    const { can, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );
    if (user.roles.includes(Role.USER)) {
      can(Action.Update, PublicUser, { id: user.id });
      can(Action.Create, Solve);
    }
    if (user.roles.includes(Role.ADMIN)) {
      can(Action.Manage, 'all');
    }
    can(Action.Read, PublicUser);
    can(Action.Read, Level);

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  @LruCache()
  createForPublic() {
    const { can, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );
    can(Action.Read, Level);
    can(Action.Read, PublicUser);
    can(Action.Create, User);
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
