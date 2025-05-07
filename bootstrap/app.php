<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ✅ Middleware global
        $middleware->use([
            HandleCors::class,
        ]);

        // ✅ Cookies que no deben ser cifradas
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // ✅ Middleware para rutas web (no necesario para tokens API, pero útil si tienes login con sesión)
        $middleware->web(prepend: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        $middleware->web(append: [
            HandleAppearance::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // ✅ Middleware para API (usa esto solo si vas a usar cookies)
        // ⚠️ Para API con tokens (Bearer Token), esto NO es obligatorio.
        // Pero puedes dejarlo sin problema.
       //$middleware->api(prepend: [
        //    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
      // ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
