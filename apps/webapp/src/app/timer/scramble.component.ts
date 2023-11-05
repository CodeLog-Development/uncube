import { Component, Input } from '@angular/core';

@Component({
  selector: 'codelog-scramble',
  template: `<span class="scramble unselectable">{{ scramble }}</span>`,
  styles: [
    `
      .scramble {
        font-size: 24px;
      }
    `,
  ],
})
export class ScrambleComponent {
  @Input({ required: true })
  scramble = '';
}
