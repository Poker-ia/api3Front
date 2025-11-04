import axios from "axios";

const API_URL = "https://api3-1-0spe.onrender.com/api/proveedor/";

export const listarProveedores = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Respuesta de listarProveedores:", response);
    // Si la respuesta es un array, devuélvelo directamente
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // Si la respuesta tiene formato paginado, devuelve results
    if (response.data.results) {
      return response.data.results;
    }
    // Si no es ninguno de los anteriores, devuelve un array vacío
    return [];
  } catch (error) {
    console.error("Error en listarProveedores:", error.response || error);
    throw new Error("Error al cargar los proveedores: " + (error.response?.data?.detail || error.message));
  }
};

export const obtenerProveedor = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error en obtenerProveedor:", error);
    throw error;
  }
};

export const crearProveedor = async (proveedor) => {
  try {
    const response = await axios.post(API_URL, proveedor);
    return response.data;
  } catch (error) {
    console.error("Error en crearProveedor:", error);
    throw error;
  }
};

export const actualizarProveedor = async (id, proveedor) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, proveedor);
    return response.data;
  } catch (error) {
    console.error("Error en actualizarProveedor:", error);
    throw error;
  }
};

export const eliminarProveedor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error en eliminarProveedor:", error);
    throw error;
  }
};
