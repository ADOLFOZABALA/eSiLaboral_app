<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Fallback para SPA (React)
|--------------------------------------------------------------------------
|
| Esta ruta permite que React maneje las rutas del frontend.
| Todas las rutas que no estén definidas en Laravel irán al frontend.
|
*/

Route::get('/{any}', function () {
    return view('app'); // o 'welcome' si estás usando la vista por defecto
})->where('any', '.*');
