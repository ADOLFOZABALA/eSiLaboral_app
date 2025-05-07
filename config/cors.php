<?php

return [

    'paths' => ['api/*', 'sanctum/token'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://localhost:8000', 
        'http://127.0.0.1:5173', 
        'http://127.0.0.1:8000'
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Si NO usas cookies, puedes mantenerlo en 'false'
    'supports_credentials' => false,
];
