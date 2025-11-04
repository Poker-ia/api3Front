import axios from "axios";

const API_URL = "https://api3-1-0spe.onrender.com/api/proveedor/";

export const listarProveedores = async () => {
  const response = await axios.get(API_URL);
  return response.data;
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
