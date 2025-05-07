<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasFactory;

    // Campos que se pueden llenar masivamente
    protected $fillable = ['name'];

    /**
     * Relación: un rol puede tener muchos usuarios
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
