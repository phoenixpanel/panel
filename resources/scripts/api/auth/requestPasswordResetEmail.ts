import http from '@/api/http';

export default (email: string, recaptchaData?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    http
      .post('/auth/password', { email, 'captcha-response': recaptchaData })
      .then((response) => resolve(response.data.status || ''))
      .catch(reject);
  });
};
