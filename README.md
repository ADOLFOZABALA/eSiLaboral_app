# 📘 eSiLaboral

Sistema de gestión de funcionarios, empleos y salarios para Corantioquia, desarrollado con **Laravel 12**, **React** y **PostgreSQL**.

---

## 🚀 Tecnologías utilizadas

- ⚙️ Backend: Laravel 12
- 🌐 Frontend: React (con Vite)
- 🛡️ Autenticación: Laravel Sanctum
- 🧠 Base de datos: PostgreSQL
- 🎨 Estilos: Bootstrap + CSS puro

---

## 🛠️ Instalación del proyecto

### Clonar el repositorio

```bash
git clone https://tu-repo.com/esilaboral.git
cd corantapp
```

### Instalar dependencias

```bash
# Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# Frontend
cd resources/js
npm install
npm run dev
```

### Configurar Sanctum

1. Ejecuta `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`.
2. Asegúrate de tener `'api' => [\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class, ...]` en `api.php`.

---

## 🔐 Configuración de autenticación

- Los usuarios se crean desde el módulo de administrador.
- Solo login está habilitado (sin registro ni recuperación de contraseña).
- Se usa `sessionStorage` para manejar la sesión en React.

---

## 📡 Rutas API (Laravel)

### 🔓 Rutas Públicas (`routes/api.php`)

| Método | Endpoint            | Descripción                        | Controlador               |
|--------|---------------------|------------------------------------|---------------------------|
| GET    | `/api/test`         | Ruta de prueba                     | Closure                   |
| POST   | `/api/login`        | Iniciar sesión                     | AuthController@login      |
| GET    | `/api/salarios`     | Obtener todos los salarios         | SalarioController@index   |
| GET    | `/api/adscritos`    | Obtener todos los adscritos        | AdscritoController@index  |

---

### 🔐 Rutas Protegidas (requieren `auth:sanctum`)

#### 🔑 Autenticación

| Método | Endpoint           | Descripción                          | Controlador            |
|--------|--------------------|--------------------------------------|------------------------|
| GET    | `/api/user`        | Obtener usuario autenticado          | AuthController@user    |
| POST   | `/api/logout`      | Cerrar sesión                        | AuthController@logout  |
| GET    | `/api/check-auth`  | Verificar sesión activa              | Closure                |

---

#### 👤 Funcionarios

| Método | Endpoint                     | Descripción                             | Controlador                 |
|--------|------------------------------|-----------------------------------------|-----------------------------|
| GET    | `/api/funcionarios`          | Listar todos los funcionarios           | FuncionarioController@index |
| GET    | `/api/funcionarios/{id}`     | Consultar funcionario por ID            | FuncionarioController@show  |
| POST   | `/api/funcionarios`          | Crear nuevo funcionario                 | FuncionarioController@store |

---

#### 💼 Empleos

| Método | Endpoint                                | Descripción                                  | Controlador                    |
|--------|-----------------------------------------|----------------------------------------------|--------------------------------|
| GET    | `/api/empleos/buscar/{identificacion}`  | Buscar empleos de un funcionario             | EmpleoController@buscarPorIdentificacion |
| POST   | `/api/empleos`                          | Crear nuevo empleo para funcionario          | EmpleoController@crearNuevoEmpleo        |
| PUT    | `/api/empleos/{id}`                     | Actualizar fecha final del empleo            | EmpleoController@actualizarFechaFinal    |

---

#### 💰 Salarios

| Método | Endpoint                        | Descripción                                 | Controlador                  |
|--------|---------------------------------|---------------------------------------------|------------------------------|
| POST   | `/api/salarios`                 | Crear nuevo salario                         | SalarioController@store      |
| PUT    | `/api/salarios/{codemp}`        | Actualizar salario por codemp               | SalarioController@update     |
| GET    | `/api/salarios/buscar`          | Obtener salarios por codemp o todos         | SalarioController@obtenerCodigosSalarios |

---

## 🎯 Funcionalidades clave

- Creación y consulta de funcionarios.
- Registro de empleos históricos para cada funcionario.
- Gestión de salarios por cargo (`codemp`).
- Roles y layout personalizados.
- Dashboard con datos básicos del usuario autenticado.
- SPA con React + Bootstrap.

---

## 📂 Estructura de carpetas relevante

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── FuncionarioController.php
│   │   │   ├── EmpleoController.php
│   │   │   ├── SalarioController.php
│   │   │   └── AdscritoController.php
│   ├── Models/
│   │   ├── Funcionario.php
│   │   ├── Empleo.php
│   │   ├── Salario.php
│   │   └── Adscrito.php
├── routes/
│   ├── api.php
│   └── web.php
├── resources/
│   └── js/ (React frontend)
```

---

## 🤝 Contribuciones

Si deseas colaborar, ¡eres bienvenido! Abre un issue o pull request 🛠️

---

## 📄 Licencia

Este proyecto es de uso interno de Corantioquia y está sujeto a licencia privada.

