import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NonAuthGuard } from './guards/non-auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pages/unauthenticated/home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'practice-exams',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pages/unauthenticated/practice-exams/practice-exams.component').then(
        (m) => m.PracticeExamsPage
      );
    },
  },
  {
    path: 'login',
    loadComponent: () => {
      return import('./pages/unauthenticated/login/login.component').then(
        (m) => m.LoginPageComponent
      );
    },
    canActivate: [NonAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => {
      return import('./pages/unauthenticated/register/register.component').then(
        (m) => m.RegisterComponent
      );
    },
    canActivate: [NonAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
