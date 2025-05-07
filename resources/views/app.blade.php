<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    {{-- CSRF token para peticiones con cookies --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Título --}}
    <title>{{ config('app.name', 'Laravel + React') }}</title>

    {{-- Fuente personalizada --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    {{-- React + Vite --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

    {{-- Script opcional para modo oscuro (si lo usas) --}}
    <script>
        (function () {
            const appearance = '{{ $appearance ?? 'system' }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            } else if (appearance === 'dark') {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    {{-- Estilos básicos (opcional) --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>
</head>

<body class="font-sans antialiased">
    <div id="root"></div>
</body>

</html>
