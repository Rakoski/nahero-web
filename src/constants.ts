declare global {
  interface Window {
    env: {
      apiUrl: string;
    };
  }
}

export const size = 6;

export const API_URL = 'https://mrakoski.tech/api/v1/';
