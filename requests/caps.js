import axios from "axios";
import { API_URL } from "../constants/API_URL";

const axiosInstance = axios.create({
  baseURL: `${API_URL}saude-mental`,
});

export const getPerfilUsuarios = async (municipioIdSus) => {
  try {
    const endpoint = "/usuarios/perfil?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getPerfilUsuariosPorEstabelecimento = async (municipioIdSus) => {
  try {
    const endpoint = "/usuarios/perfilestabelecimento?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};
