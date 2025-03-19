import { Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'outline'
  | 'outlineHover'
  | 'ghost'
  | 'link'
  | 'disabled'
  | 'light'
  | 'gray'
  | 'cardIcon'
  | 'card'
  | 'cardSelected'
  | 'back'
  | 'favorite'
  | 'inline'
  | 'home'
  | 'home-active'
  | 'filter'
  | 'filterSelected'
  | 'profile'
  | 'sidebar'
  | 'cancel'
  | 'removeTutor';

type ButtonSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | '2lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | 'icon'
  | 'full'
  | 'home';
type ButtonWidth = 'full' | 'w-35';
type ButtonFontWeight = 'normal' | 'bold' | 'semi' | 'extra';
type ButtonFontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonTypeFormat = 'square' | 'rounded' | 'circle';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [ngClass]="buttonClasses"
      [disabled]="disabled"
      [attr.aria-disabled]="disabled"
      (click)="onClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonComponent),
      multi: true,
    },
  ],
})
export class ButtonComponent implements ControlValueAccessor {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'md';
  @Input() width?: ButtonWidth;
  @Input() fontSize: ButtonFontSize = 'sm';
  @Input() fontWeight: ButtonFontWeight = 'normal';
  @Input() typeFormat: ButtonTypeFormat = 'rounded';
  @Input() disabled = false;
  @Input() type = 'button';

  private onChange = (_: any) => {};
  private onTouched = () => {};

  get buttonClasses(): string {
    const baseClasses =
      'inline-flex items-center gap-2.5 justify-center whitespace-nowrap rounded-md text-2x1 font-bold font-arial transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      primary: 'bg-primary text-primary-foreground shadow hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-card/50',
      success: 'bg-brand-lime-dark text-brand-lime-dark-foreground hover:bg-brand-lime-dark/80',
      danger: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/60',
      outline:
        'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
      outlineHover: 'border border-input bg-secondary-foreground shadow-sm text-blue-600',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      disabled: 'bg-disabled text-disabled-foreground cursor-not-allowed',
      light:
        'bg-brand-light text-brand-light-foreground hover:bg-brand-light-foreground hover:text-brand-light disabled:opacity-100',
      gray: 'bg-brand-gray text-brand-gray-foreground hover:bg-brand-gray-foreground hover:text-brand-gray',
      cardIcon: 'bg-card text-card-foreground hover:bg-card/60',
      card: 'border border-input bg-card shadow-sm hover:bg-accent hover:text-accent-foreground md:min-w-[180px] items-center justify-center',
      cardSelected:
        'bg-gradient-to-r from-brand-orange-gradient to-brand-red-gradient hover:from-brand-orange-gradient/90 hover:to-brand-red-gradient/90 md:min-w-[180px] items-center justify-center',
      back: 'bg-card text-primary-foreground',
      favorite: 'bg-card text-primary-foreground hover:bg-brand-red',
      inline: 'border border-input bg-brand-light text-card rounded-full',
      home: 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
      'home-active': 'bg-secondary border border-secondary shadow-sm',
      filter: 'border border-input',
      filterSelected:
        'bg-gradient-to-r from-brand-orange-gradient to-brand-red-gradient text-accent-foreground',
      profile: 'bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
      sidebar: '',
      cancel: 'bg-white text-black',
      removeTutor: 'rounded-md bg-brand-gray-dark-foreground hover:bg-brand-gray-medium',
    };

    const sizeClasses = {
      xs: 'h-6 px-2 text-xs',
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 py-2',
      lg: 'h-10 px-8',
      '2lg': 'h-12 px-8',
      xl: 'h-14 px-10',
      '2xl': 'h-14 px-12',
      '3xl': 'h-16 px-14',
      '4xl': 'h-20 px-16',
      icon: 'h-7 p-1.5',
      full: 'h-10 md:h-full',
      home: 'h-auto w-auto',
    };

    const widthClasses = {
      full: 'w-full',
      'w-35': 'w-[45px]',
    };

    const fontWeightClasses = {
      normal: 'font-normal',
      bold: 'font-bold',
      semi: 'font-semibold',
      extra: 'font-extrabold',
    };

    const fontSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const typeFormatClasses = {
      square: 'rounded-none',
      rounded: 'rounded-md',
      circle: 'rounded-full',
    };

    let classes = baseClasses;

    classes += ' ' + variantClasses[this.variant];
    classes += ' ' + sizeClasses[this.size];

    if (this.width) {
      classes += ' ' + widthClasses[this.width];
    }

    classes += ' ' + fontWeightClasses[this.fontWeight];
    classes += ' ' + fontSizeClasses[this.fontSize];
    classes += ' ' + typeFormatClasses[this.typeFormat];

    return classes;
  }

  onClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.onTouched();
  }

  writeValue(value: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
