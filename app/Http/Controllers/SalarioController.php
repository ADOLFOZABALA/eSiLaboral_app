<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Salario;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SalarioController extends Controller
{
    public function index()
    {
        $salarios = Salario::all()->map(function ($salario) {
            $salario->salario = floatval($salario->salario);
            $salario->salcoordinador = floatval($salario->salcoordinador);
            return $salario;
        });

        return response()->json($salarios, 200);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (!$request->bearerToken()) {
            return response()->json(['error' => 'Token no proporcionado'], 401);
        }

        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        if ($user->role->name !== 'admin') {
            return response()->json(['error' => 'No autorizado: solo administradores pueden registrar salarios'], 403);
        }

        $validator = Validator::make($request->all(), [
            'codemp' => 'required|string|max:255',
            'denominacion' => 'required|string|max:255',
            'salario' => 'required|numeric|min:0',
            'salcoordinador' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $salario = Salario::create([
                'codemp' => $request->codemp,
                'denominacion' => $request->denominacion,
                'salario' => floatval($request->salario),
                'salcoordinador' => floatval($request->salcoordinador ?? 0),
            ]);

            return response()->json([
                'message' => 'Salario registrado con éxito',
                'data' => $salario
            ], 201);
        } catch (\Exception $e) {
            Log::error('❌ Error al registrar salario: ' . $e->getMessage());
            return response()->json(['error' => 'Error al registrar salario'], 500);
        }
    }

    public function update(Request $request, $codemp)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (!$request->bearerToken()) {
            return response()->json(['error' => 'Token no proporcionado'], 401);
        }

        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        if ($user->role->name !== 'admin') {
            return response()->json(['error' => 'No autorizado: solo administradores pueden actualizar salarios'], 403);
        }

        $salario = Salario::where('codemp', $codemp)->first();

        if (!$salario) {
            return response()->json(['error' => 'Salario no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'denominacion' => 'nullable|string|max:255',
            'salario' => 'nullable|numeric|min:0',
            'salcoordinador' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $salario->update([
                'denominacion' => $request->denominacion ?? $salario->denominacion,
                'salario' => $request->has('salario') ? floatval($request->salario) : $salario->salario,
                'salcoordinador' => $request->has('salcoordinador') ? floatval($request->salcoordinador) : $salario->salcoordinador,
            ]);

            return response()->json([
                'message' => 'Salario actualizado con éxito',
                'data' => $salario
            ], 200);
        } catch (\Exception $e) {
            Log::error('❌ Error al actualizar salario: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar salario'], 500);
        }
    }

    public function obtenerCodigosSalarios(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (!$request->bearerToken()) {
            return response()->json(['error' => 'Token no proporcionado'], 401);
        }

        $codemp = $request->query('codemp');

        if ($codemp) {
            $salarios = Salario::where('codemp', $codemp)->get();
        } else {
            $salarios = Salario::select('codemp', 'denominacion', 'salario', 'salcoordinador')->distinct()->get();
        }

        if ($salarios->isEmpty()) {
            return response()->json(['message' => 'No se encontraron salarios'], 404);
        }

        $salarios = $salarios->map(function ($s) {
            $s->salario = floatval($s->salario);
            $s->salcoordinador = floatval($s->salcoordinador);
            return $s;
        });

        return response()->json($salarios, 200);
    }

    public function obtenerSoloCodemp()
    {
        $codigos = Salario::select('codemp')->distinct()->get();
        return response()->json($codigos, 200);
    }
}
