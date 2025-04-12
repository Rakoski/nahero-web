import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'table' | 'list';
type TypographyStyling = 'default' | 'gradient';
type TypographyFont = 'sans' | 'serif';

@Component({
  selector: 'app-typography',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="variant">
      <h1 *ngSwitchCase="'h1'" [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </h1>
      <h2 *ngSwitchCase="'h2'" [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </h2>
      <h3 *ngSwitchCase="'h3'" [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </h3>
      <h4 *ngSwitchCase="'h4'" [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </h4>
      <p *ngSwitchCase="'p'" [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </p>
      <blockquote *ngSwitchCase="'blockquote'" [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </blockquote>
      <div *ngSwitchCase="'table'" [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </div>
      <ul *ngSwitchCase="'list'" [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </ul>
      <p *ngSwitchDefault [ngClass]="computeClasses()">
        <ng-content></ng-content>
      </p>
    </ng-container>
  `,
})
export class TypographyComponent {
  @Input() variant: TypographyVariant = 'p';
  @Input() styling: TypographyStyling = 'default';
  @Input() font: TypographyFont = 'sans';
  @Input() className: string = '';

  computeClasses(): string {
    const baseClasses = 'leading-normal';

    const fontClasses = {
      sans: 'font-sans',
      serif: 'font-serif',
    };

    const stylingClasses = {
      default: 'text-foreground',
      gradient:
        'bg-gradient-to-r from-brand-orange-gradient to-brand-red-gradient bg-clip-text text-transparent',
    };

    const variantClasses = {
      h1: 'text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'text-3xl font-semibold tracking-tight',
      h3: 'text-2xl font-semibold tracking-tight',
      h4: 'text-xl font-semibold tracking-tight',
      p: 'leading-7',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      table: 'w-full',
      list: 'my-6 ml-6 list-disc [&>li]:mt-2',
    };

    return [
      baseClasses,
      fontClasses[this.font],
      stylingClasses[this.styling],
      variantClasses[this.variant],
      this.className,
    ].join(' ');
  }
}
