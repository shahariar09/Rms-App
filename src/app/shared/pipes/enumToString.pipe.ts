import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToString'
})
export class EnumToStringPipe implements PipeTransform {

  transform(value: number, enumType: any): string {
    
    return enumType ? enumType[value] : '';
  }
}
