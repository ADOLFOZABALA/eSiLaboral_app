<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Establecer zona horaria en PostgreSQL a America/Bogota
        if (config('database.default') === 'pgsql') {
            DB::statement("SET TIME ZONE 'America/Bogota'");
        }
    }
}
