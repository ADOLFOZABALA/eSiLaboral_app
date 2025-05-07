<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adscrito extends Model
{
    use HasFactory;

    protected $table = 'adscritos'; // Nombre correcto de la tabla

    protected $fillable = ['nombre']; // Campos que se pueden llenar masivamente

    public $timestamps = false; // No usa created_at ni updated_at

    public function empleos()
{
    return $this->hasMany(Empleo::class, 'adscrito_id');
}

}
