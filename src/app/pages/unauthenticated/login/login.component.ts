import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from '../../../components/login/login.component';
import { TbLoaderComponent } from '../../../components/tb-loader/tb-loader.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginFormComponent, TbLoaderComponent],
  templateUrl: './login.component.html',
})
export class LoginPageComponent {
  isLoading = false;
}
