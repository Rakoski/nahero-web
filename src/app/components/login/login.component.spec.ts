import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../service/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { of } from 'rxjs';

// Mock components
@Component({ selector: 'app-button', template: '', standalone: true })
class MockButtonComponent {}

@Component({ selector: 'app-tb-loader', template: '', standalone: true })
class MockTbLoaderComponent {}

@Component({ selector: 'app-checked-email-input', template: '', standalone: true })
class MockCheckedEmailInputComponent {}

@Component({ selector: 'app-password-input', template: '', standalone: true })
class MockPasswordInputComponent {}

describe('LoginComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({})),
      isLoggedIn: false
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginFormComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MockButtonComponent,
        MockTbLoaderComponent,
        MockCheckedEmailInputComponent,
        MockPasswordInputComponent
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
