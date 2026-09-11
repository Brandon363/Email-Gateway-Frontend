import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullDisplay',
  standalone: true
})
export class NullDisplayPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  transform(value: any): string {
    return value === null || value === undefined ? '---' : value;
  }

}
