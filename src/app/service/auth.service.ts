import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginResponse, RefreshTokenResponse, User } from '../model/nahero.type';
import { API_URL } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly baseUrl = API_URL;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private refreshTokenTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  get isLoggedIn(): boolean {
    return !!this.getAccessToken() && this.isTokenValid();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + 'auth/login', { email, password }).pipe(
      tap((response) => this.handleAuthentication(response)),
      catchError((error) => {
        console.log('Using API URL:', API_URL);
        console.error('Login error', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  register(email: string, password: string, name: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.baseUrl + 'auth/register', { email, password, name })
      .pipe(
        tap((response) => this.handleAuthentication(response)),
        catchError((error) => {
          console.error('Registration error', error);
          return throwError(() => new Error('Registration failed. Please try again.'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    this.currentUserSubject.next(null);
    this.stopRefreshTokenTimer();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<RefreshTokenResponse>(this.baseUrl + 'auth/refresh-token', { refreshToken })
      .pipe(
        tap((response) => this.handleRefreshToken(response)),
        catchError((error) => {
          console.error('Token refresh failed', error);
          this.logout();
          return throwError(() => new Error('Your session has expired. Please login again.'));
        })
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private handleAuthentication(response: LoginResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);

    const expiryTime = this.getTokenExpiryTime(response.accessToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    this.currentUserSubject.next(response.user);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response.user));

    this.startRefreshTokenTimer();
  }

  private handleRefreshToken(response: RefreshTokenResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);

    const expiryTime = this.getTokenExpiryTime(response.accessToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    this.startRefreshTokenTimer();
  }

  private getTokenExpiryTime(token: string): number {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      if (decodedPayload.exp) {
        return decodedPayload.exp * 1000;
      }
    } catch (error) {
      console.error('Error decoding JWT token', error);
    }

    return new Date().getTime() + 15 * 60 * 1000;
  }

  private isTokenValid(): boolean {
    const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryStr) return false;

    const expiry = parseInt(expiryStr, 10);
    return new Date().getTime() < expiry;
  }

  private startRefreshTokenTimer(): void {
    this.stopRefreshTokenTimer();

    const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryStr) return;

    const expiry = parseInt(expiryStr, 10);
    const timeout = expiry - new Date().getTime() - 30 * 1000;

    if (timeout <= 0) {
      this.refreshToken().subscribe();
      return;
    }

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private checkToken(): void {
    if (this.isLoggedIn) {
      this.startRefreshTokenTimer();

      const storedUser = localStorage.getItem(this.USER_DATA_KEY);
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user data', e);
        }
      }
    }
  }
}
