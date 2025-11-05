import axios from "axios";

const API_URL = "https://api3-1-0spe.onrender.com/api/productos/";

export const getProductos = async () => {
  try {
    const response = await axios.get(API_URL);
    return {
      ...response,
      data: response.data.results || []
    };
  } catch (error) {
    console.error("Error en getProductos:", error);
    throw error;
  }
};

export const getProducto = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`);
    return response;
  } catch (error) {
    console.error("Error en getProducto:", error);
    throw error;
  }
};

export const crearProducto = async (data) => {
  try {
    // Validar que data sea una instancia de FormData
    if (!(data instanceof FormData)) {
      throw new Error('Los datos deben ser enviados como FormData');
    }

    // Log de diagnóstico
    console.log('Datos a enviar en crearProducto:', {
      nombre: data.get('nombre'),
      modelo: data.get('modelo'),
      precio: data.get('precio'),
      stock: data.get('stock'),
      proveedor: data.get('proveedor'),
      imagen: data.get('imagen') ? 'Archivo presente' : 'No hay imagen'
    });

    // Validaciones adicionales
    const requiredFields = ['nombre', 'modelo', 'precio', 'stock', 'proveedor'];
    const missingFields = requiredFields.filter(field => !data.get(field));
    
    if (missingFields.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    // Enviar la solicitud
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    console.log('Respuesta exitosa de crearProducto:', response.data);
    return response;
  } catch (error) {
    console.error('Error en crearProducto:', {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status
    });
    
    // Mejorar el mensaje de error para el usuario
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      let errorMessage = 'Error de validación: ';
      
      if (typeof errorData === 'object') {
        errorMessage += Object.entries(errorData)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('; ');
      } else {
        errorMessage += errorData;
      }
      
      throw new Error(errorMessage);
    }
    
    throw error;
  }
};

export const editarProducto = async (id, data) => {
  try {
    console.log('Datos a enviar en editarProducto:', Object.fromEntries(data.entries()));
    
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: { 
        "Content-Type": "multipart/form-data",
      }
    });
    console.log('Respuesta de editarProducto:', response);
    return response;
  } catch (error) {
    console.error('Error detallado en editarProducto:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const eliminarProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response;
  } catch (error) {
    console.error("Error en eliminarProducto:", error);
    throw error;
  }
};
