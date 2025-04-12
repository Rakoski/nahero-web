declare global {
  interface Window {
    env: {
      apiUrl: string;
    };
  }
}

export const size = 6;

export const API_URL = window.env?.apiUrl || 'http://localhost:8080/api/v1/';
