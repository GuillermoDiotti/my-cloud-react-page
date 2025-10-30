import { API_BASE_URL, API_ENDPOINTS, RETRY_CONFIG } from './constants';

/**
 * Función base para hacer requests con manejo de errores
 */
async function fetchWithRetry(url, options = {}, retries = RETRY_CONFIG.maxAttempts) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retry attempt ${RETRY_CONFIG.maxAttempts - retries + 1}...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.delay));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

/**
 * Obtener todos los artículos IA
 */
export async function getArticulos() {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.articulos}`;
    const data = await fetchWithRetry(url);
    return {
      success: true,
      data: data.items || [],
    };
  } catch (error) {
    console.error('Error fetching articulos:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
}

/**
 * Obtener artículo por ID
 */
export async function getArticuloById(id) {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.articulos}/${id}`;
    const data = await fetchWithRetry(url);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error fetching articulo:', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}

/**
 * Obtener todos los comentarios
 */
export async function getComentarios() {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.comentarios}`;
    const data = await fetchWithRetry(url);
    return {
      success: true,
      data: data.items || [],
    };
  } catch (error) {
    console.error('Error fetching comentarios:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
}

export async function createComentario(comentarioData) {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.comentarios}`;
    const data = await fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify(comentarioData),
    });

    return {
      success: true,
      data: data,
      message: 'Comentario enviado correctamente',
    };
  } catch (error) {
    console.error('Error creating comentario:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al enviar comentario',
    };
  }
}

export function getMockArticulos() {
  return {
    success: true,
    data: [
      {
        id: '1',
        title: 'Cloud Computing en 2024',
        content: '# Introducción\n\nEste es un artículo sobre cloud computing...',
        created_at: Date.now() / 1000,
      },
      {
        id: '2',
        title: 'Serverless Architecture',
        content: '# Overview\n\nServerless permite ejecutar código sin servidores...',
        created_at: Date.now() / 1000 - 3600,
      },
      {
        id: '3',
        title: 'AWS Lambda Best Practices',
        content: '# Mejores prácticas\n\nOptimizar el cold start...',
        created_at: Date.now() / 1000 - 7200,
      },
    ],
  };
}

export function getMockComentarios() {
  return {
    success: true,
    data: [
      {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        comentario: 'Excelente sitio web!',
        created_at: Date.now() - 3600000,
      },
      {
        id: 2,
        nombre: 'María González',
        email: 'maria@example.com',
        comentario: 'Me encanta la arquitectura.',
        created_at: Date.now() - 7200000,
      },
    ],
  };
}