<?php

namespace App\Http\Controllers;

use App\Models\Funcionario;
use App\Models\Empleo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class FuncionarioController extends Controller
{
    /**
     * Crear un funcionario y su empleo.
     */
    public function guardarFuncionarioConEmpleo(Request $request): JsonResponse
    {
        try {
            // Validación de los datos recibidos
            $validatedData = $request->validate([
                'funcionario.identificacion' => 'required|numeric',
                'funcionario.nombres' => 'required|string',
                'funcionario.apellidos' => 'required|string',
                'funcionario.email' => 'required|string',
                'empleo.codemp' => 'required|exists:salarios,codemp',
                'empleo.adscrito_id' => 'required|exists:adscritos,id',
                'empleo.fecha_ingreso' => 'required|date_format:Y-m-d', // Verifica que la fecha esté en el formato correcto
            ]);

            // Crear o actualizar el funcionario (si ya existe por identificación)
            $funcionario = Funcionario::updateOrCreate(
                ['identificacion' => $request->input('funcionario.identificacion')],
                [
                    'nombres' => $request->input('funcionario.nombres'),
                    'apellidos' => $request->input('funcionario.apellidos'),
                    'email' => $request->input('funcionario.email'),
                ]
            );

            // Registrar el empleo asociado al funcionario
            $empleo = new Empleo([
                'opec' => $request->input('empleo.opec'),
                'codemp' => $request->input('empleo.codemp'),
                'vinculo' => $request->input('empleo.vinculo'),
                'adscrito_id' => $request->input('empleo.adscrito_id'),
                'resnombramiento' => $request->input('empleo.resnombramiento'),
                'acta' => $request->input('empleo.acta'),
                'resfunciones' => $request->input('empleo.resfunciones'),
                'fecha_ingreso' => $request->input('empleo.fecha_ingreso'),
                'fecha_final' => null, // Empleo actual, sin fecha final
                'coordinador' => $request->input('empleo.coordinador'),
            ]);

            // Asociar el empleo al funcionario
            $funcionario->empleos()->save($empleo);

            // Responder con mensaje de éxito y el funcionario con sus empleos
            return response()->json([
                'message' => 'Funcionario y empleo registrados correctamente',
                'funcionario' => $funcionario->load('empleos')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Manejo de error de validación
            return response()->json(['message' => 'Datos de validación incorrectos', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Manejo de errores generales
            Log::error('Error al guardar funcionario y empleo: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al guardar los datos'], 500);
        }
    }

    /**
     * Obtener los datos de un funcionario con todos sus empleos.
     */
    public function obtenerFuncionarioConEmpleos($identificacion): JsonResponse
    {
        try {
            $funcionario = Funcionario::with('empleos')
                ->where('identificacion', $identificacion)
                ->first();

            if (!$funcionario) {
                return response()->json(['message' => 'Funcionario no encontrado'], 404);
            }

            return response()->json($funcionario);
        } catch (\Exception $e) {
            Log::error('Error al obtener funcionario con empleos: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al consultar los datos'], 500);
        }
    }

    public function actualizarFuncionarioYRegistrarNuevoEmpleo(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'funcionario.identificacion' => 'required|numeric|exists:funcionarios,identificacion',
                'funcionario.nombres' => 'required|string',
                'funcionario.apellidos' => 'required|string',
                'funcionario.email' => 'required|string',
                'empleo.codemp' => 'required|exists:salarios,codemp',
                'empleo.adscrito_id' => 'required|exists:adscritos,id',
                'empleo.fecha_ingreso' => 'required|date_format:Y-m-d',
            ]);

            // 1. Actualizar datos del funcionario
            $funcionario = Funcionario::where('identificacion', $request->input('funcionario.identificacion'))->first();
            $funcionario->update([
                'nombres' => $request->input('funcionario.nombres'),
                'apellidos' => $request->input('funcionario.apellidos'),
                'email' => $request->input('funcionario.email'),
            ]);

            // 2. Cerrar el empleo actual (ponerle fecha_final si no la tiene)
            $empleoActual = $funcionario->empleos()->whereNull('fecha_final')->latest('fecha_ingreso')->first();
            if ($empleoActual) {
                $empleoActual->update([
                    'fecha_final' => now()->format('Y-m-d'), // o usa una fecha del request si se proporciona
                ]);
            }

            // 3. Registrar nuevo empleo
            $nuevoEmpleo = new Empleo([
                'opec' => $request->input('empleo.opec'),
                'codemp' => $request->input('empleo.codemp'),
                'vinculo' => $request->input('empleo.vinculo'),
                'adscrito_id' => $request->input('empleo.adscrito_id'),
                'resnombramiento' => $request->input('empleo.resnombramiento'),
                'acta' => $request->input('empleo.acta'),
                'resfunciones' => $request->input('empleo.resfunciones'),
                'fecha_ingreso' => $request->input('empleo.fecha_ingreso'),
                'fecha_final' => null,
                'coordinador' => $request->input('empleo.coordinador'),
            ]);

            $funcionario->empleos()->save($nuevoEmpleo);

            return response()->json([
                'message' => 'Funcionario actualizado, empleo anterior cerrado y nuevo empleo registrado',
                'funcionario' => $funcionario->load('empleos')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Errores de validación', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error en actualización de funcionario y empleo: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno'], 500);
        }
    }
}
