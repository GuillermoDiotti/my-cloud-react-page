export function validateComentarioForm(data) {
  const errors = {};

  if (!data.nombre || data.nombre.trim() === '') {
    errors.nombre = 'El nombre es requerido';
  } else if (data.nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  } else if (data.nombre.length > 100) {
    errors.nombre = 'El nombre no puede exceder 100 caracteres';
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'El email es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!data.comentario || data.comentario.trim() === '') {
    errors.comentario = 'El comentario es requerido';
  } else if (data.comentario.length < 10) {
    errors.comentario = 'El comentario debe tener al menos 10 caracteres';
  } else if (data.comentario.length > 1000) {
    errors.comentario = 'El comentario no puede exceder 1000 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}