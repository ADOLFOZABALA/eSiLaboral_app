// src/layouts/AuthSplitLayout.tsx
import AppLogoIcon from '@/components/app-logo-icon';
import { type PropsWithChildren } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title?: string;
  description?: string;
  name?: string;
  quote?: {
    message: string;
    author: string;
  };
}

export default function AuthSplitLayout({
  children,
  title,
  description,
  name = 'eSiLaboral',
  quote = {
    message: 'La eficiencia es hacer las cosas bien.',
    author: 'Fabricado por Adolfo Zabala',
  },
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="container-fluid vh-100 d-flex flex-column flex-lg-row p-0">
      {/* Panel izquierdo */}
      <div className="d-none d-lg-flex flex-column justify-between bg-dark text-white p-5 col-lg-6">
        <div className="d-flex align-items-center mb-3">
          <Link to="/" className="d-flex align-items-center text-white text-decoration-none fs-3 fw-semibold">
            <AppLogoIcon className="me-3" />
            {name}
          </Link>
        </div>
        {quote && (
          <blockquote className="mt-auto">
            <p className="fs-4 fst-italic mb-1">“{quote.message}”</p>
            <footer className="text-secondary">— {quote.author}</footer>
          </blockquote>
        )}
      </div>

      {/* Panel derecho */}
      <div className="d-flex flex-column justify-content-center align-items-center col-lg-6 p-4">
        <div className="w-100" style={{ maxWidth: 400 }}>
          {/* Logo móvil */}
          <div className="d-lg-none mb-4 text-center">
            <Link to="/" className="text-decoration-none">
              <AppLogoIcon className="mb-2" />
            </Link>
          </div>

          {/* Título y descripción */}
          <div className="mb-4 text-center">
            {title && <h1 className="h4 fw-bold">{title}</h1>}
            {description && <p className="text-muted small">{description}</p>}
          </div>

          {/* Contenido (formulario de login) */}
          <div className="bg-white p-4 rounded shadow-sm border">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
