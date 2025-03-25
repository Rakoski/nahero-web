declare global {
  interface Window {
    env: {
      apiUrl: string;
    };
  }
}

export const API_URL = window.env?.apiUrl || 'http://localhost:8080/api/v1/';
