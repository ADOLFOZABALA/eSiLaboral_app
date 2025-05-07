<?php

return [

    /*
    |----------------------------------------------------------------------
    | Estado del middleware de Sanctum
    |----------------------------------------------------------------------
    |
    | Esta opción es irrelevante si estás usando tokens personales sin cookies.
    | Aún así, se puede dejar como valor por defecto para evitar errores.
    |
    */
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,127.0.0.1,localhost:5173,localhost:8000',
    env('APP_URL') ? ',' . parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),

    /*
    |----------------------------------------------------------------------
    | Expiración de los tokens
    |----------------------------------------------------------------------
    |
    | Si se deja como null, los tokens personales no expirarán automáticamente.
    | Puedes poner un número en minutos si deseas caducarlos.
    |
    */
    'expiration' => null,

    /*
    |----------------------------------------------------------------------
    | Middleware
    |----------------------------------------------------------------------
    |
    | Estos middleware solo son necesarios para autenticación basada en cookies.
    | Como estás usando tokens API, puedes dejar este arreglo vacío.
    |
    */
    'middleware' => [
        'web', // Asegúrate de tener este middleware, aunque no estés usando cookies.
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ],

    /*
    |----------------------------------------------------------------------
    | Guard
    |----------------------------------------------------------------------
    |
    | Define el guard a usar para autenticar las solicitudes con Sanctum.
    | Para tokens personales, debe ser 'api'.
    |
    */
    'guard' => ['api'],

    /*
    |----------------------------------------------------------------------
    | Modelo de token personal
    |----------------------------------------------------------------------
    |
    | Este es el modelo Eloquent usado para representar tokens personales.
    | Si lo estás personalizando, cámbialo aquí.
    |
    */
];
