<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('empleos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('identificacion');
            $table->string('opec')->nullable();
            $table->string('codemp'); // clave foránea a salarios
            $table->string('vinculo')->nullable();

            // ✅ Clave foránea a adscritos (ajustado)
            $table->unsignedBigInteger('adscrito_id')->nullable();

            $table->string('resnombramiento')->nullable();
            $table->string('acta')->nullable();
            $table->string('resfunciones')->nullable();
            $table->date('fecha_ingreso');
            $table->date('fecha_final')->nullable();
            $table->boolean('coordinador')->default(false); // ✅ booleano
            $table->timestamps();

            // Relaciones
            $table->foreign('identificacion')->references('identificacion')->on('funcionarios')->onDelete('cascade');
            $table->foreign('codemp')->references('codemp')->on('salarios')->onDelete('cascade');
            $table->foreign('adscrito_id')->references('id')->on('adscritos')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empleos');
    }
};
