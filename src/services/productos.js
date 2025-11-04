import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const API_URL = API_ENDPOINTS.productos;

export const getProductos = () => axios.get(API_URL);

export const getProducto = (id) => axios.get(`${API_URL}${id}/`);

export const crearProducto = (data) =>
  axios.post(API_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const editarProducto = (id, data) =>
  axios.put(`${API_URL}${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const eliminarProducto = (id) => axios.delete(`${API_URL}${id}/`);
