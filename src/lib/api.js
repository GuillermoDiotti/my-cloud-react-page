import { API_BASE_URL, API_ENDPOINTS, RETRY_CONFIG } from './constants';

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

export async function getComentarios() {
  try {
    const url = `${API_BASE_URL}/comentarios`;
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
    const url = `${API_BASE_URL}/comentarios`;
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