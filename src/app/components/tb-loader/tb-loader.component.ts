import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tb-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="className" class="flex flex-col items-center justify-center gap-2">
      <div
        class="h-8 w-8 animate-spin rounded-full border-3 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
      <div *ngIf="message" class="text-sm text-gray-600 mt-2">{{ message }}</div>
    </div>
  `,
})
export class TbLoaderComponent {
  @Input() className: string = '';
  @Input() message: string = '';
}
