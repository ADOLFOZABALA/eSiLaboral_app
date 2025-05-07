// src/components/app-logo-icon.tsx
import React from 'react';

interface AppLogoIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function AppLogoIcon({ className = '', style }: AppLogoIconProps) {
  return (
    <img
      src="/logo.png" // Asegúrate de que este archivo exista en /public/logo.png
      alt="Logo"
      className={`img-fluid ${className}`}
      style={{ maxHeight: 60, ...style }}
    />
  );
}
