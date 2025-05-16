<?php

namespace PhoenixPanel\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PhoenixPanel\Http\Middleware\VerifyCaptcha;

class RegisterController extends Controller
{
    public function __construct()
    {
        $this->middleware(VerifyCaptcha::class)->only('register');
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'name_first' => ['required', 'string', 'max:255'],
            'name_last' => ['required', 'string', 'max:255'],
        ]);

        try {
            $user = \PhoenixPanel\Models\User::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'username' => $validatedData['username'],
                'email' => $validatedData['email'],
                'password' => \Illuminate\Support\Facades\Hash::make($validatedData['password']),
                'name_first' => $validatedData['name_first'],
                'name_last' => $validatedData['name_last'],
            ]);

            Log::info('User registered successfully', ['user_id' => $user->id]);
            return response()->json(['message' => 'User registered successfully.', 'user' => $user], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                Log::warning('Registration failed: User already exists', ['username' => $request->username, 'email' => $request->email]);
                return response()->json(['message' => 'A user with this username or email already exists.'], 409);
            }

            Log::error('Database error during registration', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'An error occurred during registration. Please try again.'], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error during registration', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'An unexpected error occurred. Please try again.'], 500);
        }
    }
}
