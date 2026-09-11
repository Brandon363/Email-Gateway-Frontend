import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlightText',
  standalone: true
})
export class HighlightTextPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(text: string, query: string): any {

    if (!query) {
      return text;
    }

    // const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // const pattern = new RegExp(`(${escapedQuery})`, 'gi');

    // const highlightedText = text.replace(pattern, (match) => `<mark>${match}</mark>`);
    // return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(${escapedQuery})`, 'gi');

    // return text.replace(pattern, (match) => `<span class="highlight">${match}</span>`);
    return text.replace(pattern, (match) => `<mark>${match}</mark>`);
  }

}
