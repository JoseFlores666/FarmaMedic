import axios from "axios";

export const getCitasByPaciente = async (codpaci) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/getCitasByPacienteId/${codpaci}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener citas:", error);
    throw error.response?.data || { message: "Error desconocido" };
  }
};

export const getListaEsperaByCita = async (citaId) => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/getListaEsperaByCitaId/${citaId}`);
    return data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`No hay lista de espera para la cita ${citaId}`);
      return []; 
    }
    console.error("Error al obtener lista de espera:", error);
    throw new Error("No se pudo cargar la lista de espera.");
  }
};