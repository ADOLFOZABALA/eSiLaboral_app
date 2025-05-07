<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleo extends Model
{
    use HasFactory;

    protected $table = 'empleos';

    protected $fillable = [
        'identificacion',
        'opec',
        'codemp',        // Relación con salarios
        'vinculo',
        'adscrito_id',
        'resnombramiento',
        'acta',
        'resfunciones',
        'fecha_ingreso',
        'fecha_final',
        'coordinador'    // Booleano: true o false
    ];

    /**
     * Relación: Un empleo pertenece a un salario.
     */
    public function salario()
    {
        return $this->belongsTo(Salario::class, 'codemp', 'codemp'); // 👈 belongsTo, no hasOne
    }

    /**
     * Relación: Un empleo pertenece a un funcionario.
     */
    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class, 'identificacion', 'identificacion');
    }

    public function adscrito()
{
    return $this->belongsTo(Adscrito::class, 'adscrito_id');
}

}
