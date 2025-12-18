import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'swapCase',
  standalone: true
})
export class SwapCasePipe implements PipeTransform {

  transform(
    value: string | null | undefined,
    mode: 'swap' | 'upper' | 'lower' | 'title' = 'title'
  ): string {
    if (!value) return '';

    switch (mode) {
      case 'upper': return value.toUpperCase();
      case 'lower': return value.toLowerCase();
      case 'title': return this.toTitleCase(value);
      default: return this.swapCase(value);
    }
  }

  private swapCase(s: string): string {
    return s.split('').map(ch => {
      if (ch >= 'A' && ch <= 'Z') return ch.toLowerCase();
      if (ch >= 'a' && ch <= 'z') return ch.toUpperCase();
      return ch;
    }).join('');
  }

  private toTitleCase(s: string): string {
    return s
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(w => w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '')
      .join(' ');
  }
}
  