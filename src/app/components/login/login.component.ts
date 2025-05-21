import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { TbLoaderComponent } from '../tb-loader/tb-loader.component';
import { CheckedEmailInputComponent } from '../input/checked-email-input.component';
import { PasswordInputComponent } from '../input/password-input.component';
import { routes } from '../../app.routes';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    TbLoaderComponent,
    CheckedEmailInputComponent,
    PasswordInputComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  successResult = '';
  errorResult = '';
  routes = routes;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.authService.isLoggedIn) {
      this.router.navigate([0]);
      return;
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorResult = '';
    this.successResult = '';

    const { identifier, password } = this.loginForm.value;

    this.authService
      .login(identifier, password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.successResult = 'Login success!';
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        },
        error: (err) => {
          if (err.status === 401) {
            this.errorResult = 'Invalud e-mail or password.';
          } else {
            this.errorResult = 'An error ocurred while logging in. Please Try again later.';
          }
        },
      });
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required.';
    }
    if (control?.hasError('email')) {
      return 'Invalid e-mail format.';
    }
    return '';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
