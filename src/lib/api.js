import { API_BASE_URL, RETRY_CONFIG, API_ENDPOINTS } from './constants';

async function fetchWithRetry(url, options = {}, retries = RETRY_CONFIG.maxAttempts) {
  try {
    console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP ${response.status}: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    return data;

  } catch (error) {
    console.error(`❌ Fetch error (${RETRY_CONFIG.maxAttempts - retries + 1}/${RETRY_CONFIG.maxAttempts}):`, error);

    if (retries > 0) {
      console.log(`⏳ Retrying in ${RETRY_CONFIG.delay}ms...`);
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
      error: ERROR_MESSAGES.server,
      data: null,
    };
  }
}

export async function getComentarios() {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.comentarios}`;
    const data = await fetchWithRetry(url);
    return {
      success: true,
      data: data.items || [],
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
}

export async function createComentario(comentarioData) {
  try {
    console.log('📝 Creating comment:', comentarioData);
    const url = `${API_BASE_URL}${API_ENDPOINTS.comentarios}`;
    const data = await fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify(comentarioData),
    });

    console.log('✅ Comment created:', data);

    return {
      success: true,
      data: data.data || data,
      message: data.message || 'Comment created successfully',
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to create comment. Please try again.',
    };
  }
}