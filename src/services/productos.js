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
    // Asegurarse de que los campos numéricos sean enviados como números
    const formData = new FormData();
    if (data.nombre) formData.append('nombre', data.nombre);
    if (data.modelo) formData.append('modelo', data.modelo);
    if (data.precio) formData.append('precio', parseFloat(data.precio));
    if (data.stock) formData.append('stock', parseInt(data.stock));
    if (data.imagen) formData.append('imagen', data.imagen);
    if (data.proveedor) formData.append('proveedor', data.proveedor);

    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.error("Error en crearProducto:", error);
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
