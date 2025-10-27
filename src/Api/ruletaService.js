import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/ruleta";

export const getWheels = async () => {
  const res = await axios.get(`${API_URL}/getWheels`);
  return res.data;
};

export const getWheelActive = async () => {
  const res = await axios.get(`${API_URL}/getWheelActive`);
  return res.data;
};

export const getWheelById = async (id) => {
  const res = await axios.get(`${API_URL}/getWheelById/${id}`);
  return res.data;
};

export const insertDataWheel = (data) =>
  axios.post(`${API_URL}/insertDataWheel`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateWheelById = (id, data) =>
  axios.put(`${API_URL}/updateWheelById/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const deleteWheelById = async (id) => {
  const res = await axios.delete(`${API_URL}/deleteWheelById/${id}`);
  return res.data;
};
