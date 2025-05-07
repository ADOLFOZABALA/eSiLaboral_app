<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request): ?string
    {
        // Si la solicitud no espera JSON (es una web), puedes redirigir
        if (! $request->expectsJson()) {
            return null; // O una URL personalizada si quieres: '/login'
        }

        // Si espera JSON, no redirigimos (Sanctum API)
        return null;
    }
}
