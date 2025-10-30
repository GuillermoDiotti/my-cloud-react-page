// Configuración centralizada de la app

// URLs de API (cambiar según entorno)
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://api.tu-sitio.com'
  : 'http://localhost:3000';     

// Endpoints
export const API_ENDPOINTS = {
  articulos: '/articulos',
  comentarios: '/comentarios',
};

// Configuración de paginación
export const ITEMS_PER_PAGE = 10;

// Mensajes de error
export const ERROR_MESSAGES = {
  network: 'Error de conexión. Verifica tu internet.',
  server: 'Error del servidor. Intenta más tarde.',
  validation: 'Por favor completa todos los campos correctamente.',
};

// Configuración de retry
export const RETRY_CONFIG = {
  maxAttempts: 3,
  delay: 1000,
};