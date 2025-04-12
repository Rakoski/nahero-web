import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from '../../../components/register/register.component';
import { TbLoaderComponent } from '../../../components/tb-loader/tb-loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RegisterFormComponent, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterPageComponent {}
