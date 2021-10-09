import { Action } from '../action.enum';
import { AppAbility, Subjects } from './casl-ability.factory';

const Can =
  (action: Action) =>
  <S extends Subjects>(entity: S) =>
  (ability: AppAbility) =>
    ability.can(action, entity);
export const CanRead = Can(Action.Read);
export const CanCreate = Can(Action.Create);
export const CanUpdate = Can(Action.Update);
export const CanDelete = Can(Action.Delete);
export const CanManage = Can(Action.Manage);
