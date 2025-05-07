<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Adscrito;
use Illuminate\Support\Facades\Log;

class AdscritoController extends Controller
{
    /**
     * Retorna la lista de adscritos disponibles (público)
     */
    public function index(Request $request)
    {
        try {
            // Arreglo plano sin paginación
            $adscritos = Adscrito::select('id', 'nombre')->get();

            if ($adscritos->isEmpty()) {
                return response()->json(['message' => 'No se encontraron registros de adscritos'], 204);
            }

            return response()->json(['data' => $adscritos], 200);
        } catch (\Exception $e) {
            Log::error('❌ Error al obtener adscritos: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener adscritos'], 500);
        }
    }
}
