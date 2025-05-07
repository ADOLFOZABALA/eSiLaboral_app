<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Funcionario extends Model
{
    use HasFactory;

    protected $table = 'funcionarios'; // Nombre de la tabla

    protected $primaryKey = 'identificacion'; // La clave primaria es identificación
    public $incrementing = false; // Como es un número, no es autoincremental
    protected $keyType = 'bigInteger';

    protected $fillable = ['identificacion', 'nombres', 'apellidos', 'email'];

    /**
     * Relación: un funcionario puede tener muchos empleos.
     */
    public function empleos()
    {
        return $this->hasMany(Empleo::class, 'identificacion', 'identificacion');
    }

    /**
     * Relación: un funcionario puede tener un usuario asociado.
     */
    public function user()
    {
        return $this->hasOne(User::class, 'identificacion', 'identificacion');
    }
}
