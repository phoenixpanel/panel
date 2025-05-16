<?php

namespace PhoenixPanel\Http\Middleware;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use PhoenixPanel\Events\Auth\FailedCaptcha;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;
use Symfony\Component\HttpKernel\Exception\HttpException;

class VerifyCaptcha
{
    /**
     * VerifyCaptcha constructor.
     */
    public function __construct(private Dispatcher $dispatcher, private Repository $config)
    {
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, \Closure $next): mixed
    {
        if (!$this->config->get('phoenixpanel.captcha.enabled')) {
            return $next($request);
        }

        $captchaProvider = $this->config->get('phoenixpanel.captcha.provider');

        if ($captchaProvider === 'google') {
            $responseKey = 'captcha-response';
            $secretKey = $this->config->get('phoenixpanel.captcha.google.secret_key');
        } elseif ($captchaProvider === 'cloudflare') {
            $responseKey = 'cf-turnstile-response';
            $secretKey = $this->config->get('phoenixpanel.captcha.cloudflare.secret_key');
        } else {
            throw new \Exception('Invalid captcha provider specified.');
        }

        if (empty($secretKey)) {
            return $next($request);
        }

        if ($request->filled($responseKey)) {
            $client = new Client();
            $verificationUrl = '';

            if ($captchaProvider === 'google') {
                $verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
            } elseif ($captchaProvider === 'cloudflare') {
                $verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
            }

            $res = $client->post($verificationUrl, [
                'form_params' => [
                    'secret' => $secretKey,
                    'response' => $request->input($responseKey),
                ],
            ]);

            if ($res->getStatusCode() === 200) {
                $result = json_decode($res->getBody());

                if ($result->success && $this->isResponseVerified($result, $request)) {
                    return $next($request);
                }
            } else {
                $this->dispatcher->dispatch(
                    new FailedCaptcha(
                        $request->ip(),
                        $request->getHost()
                    )
                );

                throw new HttpException(Response::HTTP_BAD_REQUEST, 'Failed to validate CAPTCHA data.');
            }
        }

        return $next($request);
    }

    /**
     * Determine if the response from the recaptcha servers was valid.
     */
    function isResponseVerified(\stdClass $result, Request $request): bool
    {
        $url = parse_url($this->config->get('app.url'));

        $verifyDomain = $this->config->get('phoenixpanel.captcha.verify_domain');

        if ($verifyDomain) {
            return $result->hostname === parse_url($this->config->get('app.url'), PHP_URL_HOST);
        } else {
            return true;
        }


        return $result->hostname === array_get($url, 'host');
    }
}
