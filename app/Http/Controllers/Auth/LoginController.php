<?php

namespace PhoenixPanel\Http\Controllers\Auth;

use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use PhoenixPanel\Models\User;
use Illuminate\Http\JsonResponse;
use PhoenixPanel\Facades\Activity;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\View\View;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use PhoenixPanel\Http\Middleware\VerifyCaptcha;

class LoginController extends AbstractLoginController
{
    /**
     * LoginController constructor.
     */
    public function __construct(private ViewFactory $view)
    {
        parent::__construct();
    }

    /**
     * Handle all incoming requests for the authentication routes and render the
     * base authentication view component. React will take over at this point and
     * turn the login area into an SPA.
     */
    public function index(): View
    {
        return $this->view->make('templates/auth.core');
    }

    /**
     * Handle a login request to the application.
     *
     * @throws \PhoenixPanel\Exceptions\DisplayException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        // DEBUG: Log controller method execution
        Log::info('LoginController: login() method executing', [
            'ip' => $request->ip(),
            'username' => $request->input('user'),
            'route' => $request->route()->getName()
        ]);

        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);
            $this->sendLockoutResponse($request);
        }

        try {
            $username = $request->input('user');

            // DEBUG: Log user lookup attempt
            Log::debug('LoginController: Looking up user', ['username' => $username]);

            /** @var \PhoenixPanel\Models\User $user */
            $user = User::query()->where($this->getField($username), $username)->firstOrFail();
        } catch (ModelNotFoundException) {
            // DEBUG: Log user not found
            Log::warning('LoginController: User not found, calling sendFailedLoginResponse', [
                'username' => $username ?? 'unknown'
            ]);
            $this->sendFailedLoginResponse($request);
        }

        // Ensure that the account is using a valid username and password before trying to
        // continue. Previously this was handled in the 2FA checkpoint, however that has
        // a flaw in which you can discover if an account exists simply by seeing if you
        // can proceed to the next step in the login process.
        if (!password_verify($request->input('password'), $user->password)) {
            // DEBUG: Log password verification failure
            Log::warning('LoginController: Password verification failed, calling sendFailedLoginResponse', [
                'user_id' => $user->id,
                'username' => $user->username
            ]);
            $this->sendFailedLoginResponse($request, $user);
        }

        if (!$user->use_totp) {
            return $this->sendLoginResponse($user, $request);
        }

        Activity::event('auth:checkpoint')->withRequestMetadata()->subject($user)->log();

        $request->session()->put('auth_confirmation_token', [
            'user_id' => $user->id,
            'token_value' => $token = Str::random(64),
            'expires_at' => CarbonImmutable::now()->addMinutes(5),
        ]);

        return new JsonResponse([
            'data' => [
                'complete' => false,
                'confirmationToken' => $token,
            ],
        ]);
    }
}


