import http from '@/api/http';

export interface LoginResponse {
    complete: boolean;
    intended?: string;
    confirmationToken?: string;
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
        http.get('/sanctum/csrf-cookie')
            .then(() =>
                http.post('/auth/login', data)
            )
            .then((response: { data: { data: LoginResponse } }) => {
                if (!(response.data instanceof Object)) {
                    return reject(new Error('An error occurred while processing the login request.'));
                }

                return resolve({
                    complete: response.data.data.complete,
                    intended: response.data.data.intended || undefined,
                    confirmationToken: response.data.data.confirmationToken || undefined,
                });
            })
            .catch(reject);
    });
};
