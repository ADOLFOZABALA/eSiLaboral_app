<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('adscritos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique(); // puedes quitar unique si quieres permitir duplicados
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adscritos');
    }
};
