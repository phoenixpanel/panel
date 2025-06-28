import http from '@/api/http';

interface RegisterData {
    username: string;
    email: string;
    password: string;
    name_first: string;
    name_last: string;
    recaptchaData?: string;
}

export default (data: RegisterData): Promise<void> => {
    return http.post('/auth/register', data);
};
