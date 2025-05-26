import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { TbLoaderComponent } from '../tb-loader/tb-loader.component';
import { CheckedEmailInputComponent } from '../input/checked-email-input.component';
import { PasswordInputComponent } from '../input/password-input.component';
import { routes } from '../../app.routes';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../service/user/user.service';
import { TextInputComponent } from '../input/text-input/text-input.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    TbLoaderComponent,
    FormsModule,
    CheckedEmailInputComponent,
    PasswordInputComponent,
    TextInputComponent,
  ],
  templateUrl: './register.component.html',
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  successResult = '';
  errorResult = '';
  routes = routes;
  isPassportMode = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private matchPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

private validateCPF(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  
  const cpf = control.value?.replace(/[^\d]/g, '');
  
  if (!cpf) {
    return { invalidCpf: true };
  }
  
  if (cpf.length === 11) {
    if (/^(\d)\1+$/.test(cpf)) {
      return { invalidCpf: true };
    }
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return { invalidCpf: true };
    }
    
    sum = 0;
    
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return { invalidCpf: true };
    }
  } else if (cpf.length > 0 && cpf.length !== 11) {
    return { invalidCpf: true };
  }
  
  return null;
}

  private validatePassport(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const passport = control.value.trim();

    if (passport.length < 6 || passport.length > 15) {
      return { invalidPassport: true };
    }

    return null;
  }

  toggleIdentificationMethod(): void {
    this.isPassportMode = !this.isPassportMode;

    this.registerForm.get('cpf')?.setValue('');
    this.registerForm.get('passportNumber')?.setValue('');

    if (this.isPassportMode) {
      this.registerForm.get('cpf')?.clearValidators();
      this.registerForm
        .get('passportNumber')
        ?.setValidators([Validators.required, this.validatePassport]);
    } else {
      this.registerForm.get('cpf')?.setValidators([Validators.required, this.validateCPF]);
      this.registerForm.get('passportNumber')?.clearValidators();
    }

    this.registerForm.get('cpf')?.updateValueAndValidity();
    this.registerForm.get('passportNumber')?.updateValueAndValidity();
  }

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        cpf: ['', [Validators.required, this.validateCPF]],
        passportNumber: ['', []],
        phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.matchPasswords }
    );
  }


handleSubmit(): void {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.errorResult = '';
  this.successResult = '';

  const { name, cpf, passportNumber, phone, email, password } = this.registerForm.value;
  
  let formattedCpf = cpf;
  if (cpf) {
    const cleanCpf = cpf.replace(/[^\d]/g, '');
    if (cleanCpf.length === 11) {
      formattedCpf = cleanCpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
  }

  this.userService
    .register({ name, cpf: formattedCpf, passportNumber, phone, email, password })
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe({
      next: () => {
        this.successResult = 'Register success!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err: any) => {
        if (err.status === 409) {
          this.errorResult = 'E-mail or document already registered!';
        } else {
          this.errorResult = 'An error occurred while registering. Please try again later.';
        }
      },
    });
}

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);

    if (control?.hasError('required')) {
      return 'This field is required.%';
    }
    if (control?.hasError('email')) {
      return 'Invalid e-mail format.';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `This field has to have at least ${requiredLength} characters.`;
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'phone') {
        return 'Invalid phone format.';
      }
      return 'Invalid format.';
    }
    if (control?.hasError('invalidCpf')) {
      return 'Invalid CPF.';
    }
    if (control?.hasError('invalidPassport')) {
      return 'Invalid passport number.';
    }
    if (this.registerForm.hasError('passwordMismatch') && controlName === 'confirmPassword') {
      return 'Passwords do not coincide.';
    }

    return '';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  formatCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
    }

    this.registerForm.get('cpf')?.setValue(value);
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2})$/, '($1');
    }

    this.registerForm.get('phone')?.setValue(value);
  }
}
