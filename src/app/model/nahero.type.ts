export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  passportNumber: string;
  bio: string;
  phone: string;
  avatarUrl: string;
  emailConfirmedAt: string;
  externalCustomerId: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
  roles: {
    id: number;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
