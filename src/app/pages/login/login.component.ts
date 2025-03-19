import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from '../../components/login/login.component';
import { TbLoaderComponent } from '../../components/tb-loader/tb-loader.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginFormComponent, TbLoaderComponent],
  template: `
    <div class="h-full w-full p-5 md:p-10 md:mt-16">
      <div class="flex flex-col items-center justify-center md:flex-row">
        <div *ngIf="isLoading; else loginForm">
          <app-tb-loader class="mt-44"></app-tb-loader>
        </div>
        <ng-template #loginForm>
          <app-login-form></app-login-form>
        </ng-template>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  isLoading = false;
}
