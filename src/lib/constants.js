import { apiEndpoint } from '../config';

export const API_BASE_URL = apiEndpoint;

export const API_ENDPOINTS = {
  articulos: '/articles',
  comentarios: '/comentarios',
};

// Configuración de paginación
export const ITEMS_PER_PAGE = 10;

// Configuración de retry
export const RETRY_CONFIG = {
  maxAttempts: 3,
  delay: 1000,
};