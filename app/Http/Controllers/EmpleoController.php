<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Empleo;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class EmpleoController extends Controller
{
    /**
     * Buscar empleos de un funcionario por identificación.
     */
    public function buscarPorIdentificacion($identificacion): JsonResponse
    {
        $empleos = Empleo::where('identificacion', $identificacion)->get();

        if ($empleos->isEmpty()) {
            return response()->json(['message' => 'No se encontraron empleos para esta identificación'], 404);
        }

        return response()->json($empleos, 200);
    }

    /**
     * Actualizar la fecha final de un empleo existente.
     */
    public function actualizarFechaFinal(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        if (!$request->bearerToken()) {
            return response()->json(['message' => 'Token no proporcionado'], 401);
        }

        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        if ($user->role->name !== 'admin') {
            return response()->json(['message' => 'No autorizado: solo administradores pueden actualizar empleos'], 403);
        }

        try {
            $request->validate([
                'fecha_final' => 'nullable|date',
            ]);

            $empleo = Empleo::findOrFail($id);
            $empleo->fecha_final = $request->fecha_final;
            $empleo->save();

            return response()->json([
                'message' => 'Fecha final del empleo actualizada correctamente',
                'empleo' => $empleo
            ], 200);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('❌ Error al actualizar la fecha final del empleo: ' . $e->getMessage());
            return response()->json(['message' => 'Error al actualizar la fecha final del empleo'], 500);
        }
    }

    /**
     * Agregar un nuevo empleo para un funcionario.
     */
    public function crearNuevoEmpleo(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        if (!$request->bearerToken()) {
            return response()->json(['message' => 'Token no proporcionado'], 401);
        }

        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        if ($user->role->name !== 'admin') {
            return response()->json(['message' => 'No autorizado: solo administradores pueden crear empleos'], 403);
        }

        try {
            $validatedData = $request->validate([
                'identificacion'   => 'required|numeric|exists:funcionarios,identificacion',
                'opec'             => 'nullable|string|max:255',
                'codemp'           => 'nullable|string|max:255',
                'vinculo'          => 'nullable|string|max:255',
                'adscrito'         => 'nullable|string|max:255',
                'resnombramiento'  => 'nullable|string|max:255',
                'acta'             => 'nullable|string|max:255',
                'resfunciones'     => 'nullable|string|max:255',
                'fecha_ingreso'    => 'nullable|date',
                'fecha_final'      => 'nullable|date',
                'coordinador'      => 'boolean',
            ]);

            $empleo = Empleo::create([
                'identificacion'   => $validatedData['identificacion'],
                'opec'             => $validatedData['opec'] ?? null,
                'codemp'           => $validatedData['codemp'] ?? null,
                'vinculo'          => $validatedData['vinculo'] ?? null,
                'adscrito'         => $validatedData['adscrito'] ?? null,
                'resnombramiento'  => $validatedData['resnombramiento'] ?? null,
                'acta'             => $validatedData['acta'] ?? null,
                'resfunciones'     => $validatedData['resfunciones'] ?? null,
                'fecha_ingreso'    => $validatedData['fecha_ingreso'] ?? null,
                'fecha_final'      => $validatedData['fecha_final'] ?? null,
                'coordinador'      => $validatedData['coordinador'] ?? false,
            ]);

            return response()->json([
                'message' => '✅ Nuevo empleo agregado correctamente',
                'empleo' => $empleo
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('❌ Error al agregar un nuevo empleo: ' . $e->getMessage());
            return response()->json(['message' => 'Error al agregar un nuevo empleo'], 500);
        }
    }

    /**
     * Mostrar todos los empleos (index).
     */
    public function index(): JsonResponse
    {
        $empleos = Empleo::all();
        return response()->json($empleos, 200);
    }

    /**
     * Mostrar un empleo específico por ID (show).
     */
    public function show($id): JsonResponse
    {
        $empleo = Empleo::find($id);

        if (!$empleo) {
            return response()->json(['message' => 'Empleo no encontrado'], 404);
        }

        return response()->json($empleo, 200);
    }
}
