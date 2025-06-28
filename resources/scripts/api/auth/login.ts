import http from '@/api/http';
import { AxiosError } from 'axios';

export interface LoginResponse {
  complete: boolean;
  intended?: string;
  confirmationToken?: string;
  user?: {
    uuid: string;
    username: string;
    email: string;
    language: string;
    root_admin: boolean;
    use_totp: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface LoginData {
  username: string;
  password: string;
  captchaKey?: string;
  captchaData?: string | null;
}

export default ({ username, password, captchaKey, captchaData }: LoginData): Promise<LoginResponse> => {
  const data: any = { user: username, password };
  if (captchaKey && captchaData) {
    data[captchaKey] = captchaData;
  }

  return new Promise((resolve, reject) => {
    http
      .get('/sanctum/csrf-cookie')
      .then(() => http.post('/auth/login', data))
      .then((response: { data: { data: LoginResponse } }) => {
        if (!(response.data instanceof Object)) {
          return reject(new Error('An error occurred while processing the login request.'));
        }

        return resolve({
          complete: response.data.data.complete,
          intended: response.data.data.intended || undefined,
          confirmationToken: response.data.data.confirmationToken || undefined,
          user: response.data.data.user || undefined,
        });
      })
      .catch((error: any) => {
        // Revert to any type as requested previously
        // Check if the error is an HTTP error with status 400 and the specific captcha failure message
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data &&
          Array.isArray(error.response.data.errors) &&
          error.response.data.errors.length > 0 &&
          error.response.data.errors[0].detail === 'Failed to validate CAPTCHA data.'
        ) {
          reject(new Error('Incorrect captcha, please try again!'));
        } else {
          // Otherwise, reject with the original error
          reject(error);
        }
      });
  });
};
