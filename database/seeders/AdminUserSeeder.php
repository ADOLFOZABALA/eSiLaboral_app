<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Funcionario;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear el rol 'admin' si no existe
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // 2. Crear funcionario con identificación 79870221
        $funcionario = Funcionario::firstOrCreate(
            ['identificacion' => 79870221],
            [
                'nombres' => 'José Adolfo',
                'apellidos' => 'Administrador',
                'email' => 'admin@example.com',
                'fecha_ingreso' => now(), // opcional, si existe este campo
            ]
        );

        // 3. Crear usuario ligado al funcionario
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'José Adolfo',
                'password' => Hash::make('pwd123'),
                'identificacion' => $funcionario->identificacion,
                'role_id' => $adminRole->id,
            ]
        );
    }
}
