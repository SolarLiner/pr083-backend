import { Injectable, PipeTransform } from '@nestjs/common';

type EnsureArray<T> = T extends Array<any> ? T : T[];

@Injectable()
export class EnsureArrayPipe<T>
  implements PipeTransform<T | T[], EnsureArray<T>>
{
  // @ts-expect-error type narrowing potentially overlaps with generic type itself
  transform(value: T | T[]) {
    if (Array.isArray(value)) return value;
    return [value];
  }
}
