import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const API_URL = API_ENDPOINTS.proveedor;

export const listarProveedores = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Respuesta de listarProveedores:", response);
    return response.data;
  } catch (error) {
    console.error("Error en listarProveedores:", error);
    throw error;
  }
};

export const obtenerProveedor = async (id) => {
  const response = await axios.get(`${API_URL}${id}/`);
  return response.data;
};

export const crearProveedor = async (proveedor) => {
  const response = await axios.post(API_URL, proveedor);
  return response.data;
};

export const actualizarProveedor = async (id, proveedor) => {
  const response = await axios.put(`${API_URL}${id}/`, proveedor);
  return response.data;
};

export const eliminarProveedor = async (id) => {
  const response = await axios.delete(`${API_URL}${id}/`);
  return response.data;
};
