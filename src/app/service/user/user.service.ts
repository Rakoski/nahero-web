import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../constants';

export interface UserRegistration {
  name: string;
  cpf?: string;
  passportNumber?: string;
  phone: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${API_URL}users`;

  constructor(private http: HttpClient) {}

  register(userData: UserRegistration): Observable<UserResponse> {
    const cleanedData = {
      ...userData,
      cpf: userData.cpf ? userData.cpf.replace(/\D/g, '') : undefined,
      phone: userData.phone.replace(/\D/g, ''),
    };

    return this.http.post<UserResponse>(this.apiUrl, cleanedData);
  }
}
