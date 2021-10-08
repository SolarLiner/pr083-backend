import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DefaultValuePipe<T> implements PipeTransform<T|null|undefined, T> {
  constructor(private readonly defaultValue: T) {
  }

  transform(value: T | null | undefined, metadata: ArgumentMetadata): T {
    return value ?? this.defaultValue;
  }
}
