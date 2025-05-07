<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salarios', function (Blueprint $table) {
            $table->string('codemp')->primary(); // Clave primaria no autoincremental
            $table->string('denominacion');      // Nombre del cargo o similar
            $table->integer('salario', 12, 0);   // Salario base
            $table->integer('salcoordinacion', 12, 0)->nullable(); // Salario adicional si es coordinador
            $table->integer('vigencia');            // Vigencia del salario año
            $table->timestamps();                // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salarios');
    }
};
