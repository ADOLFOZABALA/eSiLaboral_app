<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Atributos asignables masivamente.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'identificacion', // Relación con funcionarios
        'role_id',         // Relación con roles
    ];

    /**
     * Atributos ocultos al serializar.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Atributos convertidos a tipos nativos.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Relación: un usuario pertenece a un rol.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Relación: un usuario está asociado a un funcionario.
     */
    public function funcionario()
    {
        return $this->belongsTo(Funcionario::class, 'identificacion', 'identificacion');
    }

    /**
     * Método adicional: verificar si el usuario tiene un rol específico.
     */
    public function hasRole($roleName)
    {
        // Usar optional para evitar errores si 'role' es null
        return optional($this->role)->name === $roleName;
    }
}
