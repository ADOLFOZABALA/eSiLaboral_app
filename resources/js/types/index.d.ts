import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

/**
 * Rol único que tiene un usuario
 */
export interface Role {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

/**
 * Información del usuario autenticado
 */
export interface User {
    id: number;
    name: string;
    email: string;
    role: Role; // 👈 Aquí corregido: es un solo rol (objeto), no un array
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

/**
 * Datos de autenticación disponibles globalmente
 */
export interface Auth {
    user: User;
}

/**
 * Elemento individual del breadcrumb
 */
export interface BreadcrumbItem {
    title: string;
    href: string;
}

/**
 * Grupo de navegación (menú lateral, etc.)
 */
export interface NavGroup {
    title: string;
    items: NavItem[];
}

/**
 * Opción del menú de navegación
 */
export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[]; // Lista de roles permitidos para ver este ítem, ej. ['admin', 'user']
}

/**
 * Datos compartidos entre frontend y backend (Inertia, Ziggy, etc.)
 */
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
