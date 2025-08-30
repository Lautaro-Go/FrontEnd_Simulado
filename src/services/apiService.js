import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // ruta fija

export async function resolverMetodoNumerico(payload) {
  try {
    const response = await axios.post(`${BASE_URL}/resolver`, payload);
    return response.data;
  } catch (error) {
    // logs útiles
    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;
    console.error("Error al llamar a la API:", {
      message: error?.message,
      status,
      detail,
      payload,
    });
    throw error;
  }
}
