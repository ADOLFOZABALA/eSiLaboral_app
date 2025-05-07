<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FuncionarioController;
use App\Http\Controllers\EmpleoController;
use App\Http\Controllers\SalarioController;
use App\Http\Controllers\AdscritoController;

/*
|--------------------------------------------------------------------------
| Rutas públicas de la API
|--------------------------------------------------------------------------
*/

Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

// 🔓 Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::get('/salarios', [SalarioController::class, 'index']);
Route::get('/adscritos', [AdscritoController::class, 'index']);
Route::get('/codigos-salario', [SalarioController::class, 'obtenerSoloCodemp']);

/*
|--------------------------------------------------------------------------
| Rutas protegidas con Sanctum (requiere autenticación por token)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/check-auth', function () {
        dd(auth()->user());
        return response()->json([
            'message' => 'Autenticado como: ' . auth()->user()?->name
        ]);
    });

    // ✅ Nueva ruta: actualizar funcionario, cerrar empleo actual y registrar nuevo empleo
    Route::post('/funcionarios/actualizar-y-nuevo-empleo', [FuncionarioController::class, 'actualizarFuncionarioYRegistrarNuevoEmpleo']);
});

// 👤 CRUD de Funcionarios
Route::prefix('funcionarios')->group(function () {
    Route::get('/', [FuncionarioController::class, 'index']);
    Route::get('/{identificacion}', [FuncionarioController::class, 'show']);
    // ✅ Ruta única para obtener los empleos de un funcionario
    Route::get('/{identificacion}/empleos', [FuncionarioController::class, 'obtenerFuncionarioConEmpleos']);
    Route::post('/', [FuncionarioController::class, 'store']);
    Route::put('/{identificacion}', [FuncionarioController::class, 'update']);
    Route::delete('/{identificacion}', [FuncionarioController::class, 'destroy']);
});

// ✅ Ruta especial para crear funcionario + empleo
Route::post('/funcionarios-con-empleo', [FuncionarioController::class, 'guardarFuncionarioConEmpleo']);

// 💼 CRUD de Empleos
Route::prefix('empleos')->group(function () {
    Route::get('/', [EmpleoController::class, 'index']);
    Route::get('/buscar/{identificacion}', [EmpleoController::class, 'buscarPorIdentificacion']);
    Route::post('/', [EmpleoController::class, 'crearNuevoEmpleo']);
    Route::put('/{id}', [EmpleoController::class, 'actualizarFechaFinal']);
});

// 💰 CRUD de Salarios
Route::prefix('salarios')->group(function () {
    Route::post('/', [SalarioController::class, 'store']);
    Route::put('/{codemp}', [SalarioController::class, 'update']);
    Route::get('/buscar', [SalarioController::class, 'obtenerCodigosSalarios']);
});

// 🔐 Crear token personal
Route::post('/tokens/create', function (Request $request) {
    $request->validate([
        'token_name' => 'required|string|max:255'
    ]);

    $token = $request->user()->createToken($request->token_name);

    return response()->json([
        'token' => $token->plainTextToken
    ]);
});
