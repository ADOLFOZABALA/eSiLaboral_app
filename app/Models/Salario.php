<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salario extends Model
{
    use HasFactory;

    protected $table = 'salarios';

    protected $primaryKey = 'codemp';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'codemp',
        'denominacion',
        'salario',
        'salcoordinacion',
        'vigencia',
    ];

    protected $casts = [
        'codemp' => 'string',        
        'vigencia' => 'string',
    ];

    /**
     * Relación: un salario puede tener un empleo.
     */
    public function empleo()
    {
        return $this->hasOne(Empleo::class, 'codemp', 'codemp');
    }
}
