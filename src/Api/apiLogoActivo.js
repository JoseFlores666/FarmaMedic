import axios from "axios";

export const getLogoActivo = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/getLogoActivo`
    );

    if (data && data.url) {
      return data.url;
    }

    return null;
  } catch (error) {
    console.error("Error obteniendo logo activo:", error);
    return null;
  }
};
