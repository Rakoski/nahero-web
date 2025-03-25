import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center gap-2.5 justify-center whitespace-nowrap rounded-md text-2x1 font-bold font-arial transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
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
      },
      size: {
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
      },
      width: {
        full: 'w-full',
        'w-35': 'w-[45px]',
      },
      fontWeight: {
        normal: 'font-normal',
        bold: 'font-bold',
        semi: 'font-semibold',
        extra: 'font-extrabold',
      },
      fontSize: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      typeFormat: {
        square: 'rounded-none',
        rounded: 'rounded-md',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fontWeight: 'normal',
      fontSize: 'sm',
      typeFormat: 'rounded',
    },
  }
);

export type ButtonProps = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [attr.aria-disabled]="disabled()"
      (click)="onClick($event)"
      [class]="computedClasses()"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonProps['variant']>('default');
  readonly size = input<ButtonProps['size']>('md');
  readonly width = input<ButtonProps['width']>();
  readonly fontSize = input<ButtonProps['fontSize']>('sm');
  readonly fontWeight = input<ButtonProps['fontWeight']>('normal');
  readonly typeFormat = input<ButtonProps['typeFormat']>('rounded');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly buttonClick = output<MouseEvent>();

  protected computedClasses = computed(() =>
    cn(
      buttonVariants({
        variant: this.variant(),
        size: this.size(),
        width: this.width(),
        fontSize: this.fontSize(),
        fontWeight: this.fontWeight(),
        typeFormat: this.typeFormat(),
      }),
      this.class()
    )
  );

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.buttonClick.emit(event);
  }
}

export { buttonVariants };
