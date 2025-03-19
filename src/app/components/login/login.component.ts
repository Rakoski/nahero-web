import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { TbLoaderComponent } from '../tb-loader/tb-loader.component';
import { CheckedEmailInputComponent } from '../input/checked-email-input.component';
import { PasswordInputComponent } from '../input/password-input.component';
import { TypographyComponent } from '../typography/typography.component';
import { LoginEnum } from '../../../lib/enum/login-form-enum';
import { routes } from '../../app.routes';

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
  template: `
    <div class="flex flex-col w-full sm:w-96 md:w-[750px] lg:w-[700px] md:h-[500px] mx-auto">
      <div class="text-left mb-4">
        <h2 class="text-3xl font-bold text-yellow-500">Já faz parte do time Nahero?</h2>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="handleSubmit()" class="flex flex-col gap-1">
        <div class="flex flex-col gap-1">
          <app-checked-email-input
            placeholder="E-mail"
            formControlName="identifier"
            class="w-full h-12"
          ></app-checked-email-input>
          <span
            *ngIf="
              loginForm.get('identifier')?.invalid &&
              (loginForm.get('identifier')?.dirty || loginForm.get('identifier')?.touched)
            "
            class="text-sm text-red-500"
          >
            {{ getErrorMessage('identifier') }}
          </span>
        </div>

        <div class="flex flex-col gap-1">
          <app-password-input
            placeholder="Senha"
            formControlName="password"
            class="w-full h-12"
          ></app-password-input>
          <span
            *ngIf="
              loginForm.get('password')?.invalid &&
              (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)
            "
            class="text-sm text-red-500"
          >
            {{ getErrorMessage('password') }}
          </span>
        </div>

        <div class="flex justify-start md:mt-2 md:mb-2">
          <a class="text-md font-bold cursor-pointer hover:underline text-brand-orange-gradient">
            Esqueceu sua senha?
          </a>
        </div>

        <app-button
          [disabled]="isLoading"
          type="submit"
          variant="primary"
          fontSize="lg"
          fontWeight="bold"
          size="lg"
          width="full"
          class="bg-yellow-600 hover:bg-yellow-700 h-10 rounded-md"
        >
          <ng-container *ngIf="isLoading; else loginText">
            <app-tb-loader></app-tb-loader>
          </ng-container>
          <ng-template #loginText>Entrar</ng-template>
        </app-button>

        <div class="h-6 flex justify-center mt-2">
          <span *ngIf="isLoading">{{ isLoading }}</span>
          <span *ngIf="successResult">{{ successResult }}</span>
          <span *ngIf="errorResult" class="text-red-500">{{ errorResult }}</span>
        </div>

        <div
          class="w-full bg-gray-200 p-1 md:p-3 rounded-md flex justify-center items-center md:mt-6 gap-3"
        >
          <span class="text-gray-700 md:ml-0 ml-3">Novo por aqui?</span>
          <a class="font-bold cursor-pointer hover:underline text-yellow-700 rounded-md">
            Cadastre-se agora!
          </a>
        </div>
      </form>
    </div>
  `,
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  successResult = '';
  errorResult = '';
  loginEnum = LoginEnum;
  routes = routes;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { identifier, password } = this.loginForm.value;

    // Simulating login service call or use your actual service
    setTimeout(() => {
      this.isLoading = false;
      if (identifier && password) {
        this.successResult = 'Login successful';
        // this.router.navigate([routes.Home]);
      } else {
        this.errorResult = 'Invalid credentials';
      }
    }, 1500);
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    return '';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToExternal(url: string): void {
    window.location.href = url;
  }
}
