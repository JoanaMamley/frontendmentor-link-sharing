import { Pipe, PipeTransform } from '@angular/core';
import { Link } from '../models/link.model';

@Pipe({
  name: 'linksSort',
  standalone: true
})
export class LinksSortPipe implements PipeTransform {

  transform(value: Link[]): Link[] {
    const compareFn = (a: Link, b: Link) => {
      if (a.id === -1 && b.id !== -1) return -11
      else if (b.id === -1 && a.id !== -1 ) return 1
      else {
        return 0
      }
    }

    value.sort(compareFn)
    return value
  }

}
