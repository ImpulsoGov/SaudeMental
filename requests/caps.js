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

export const getNovosUsuarios = async (municipioIdSus) => {
  try {
    const endpoint = "/usuarios/novos?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getResumoNovosUsuarios = async (municipioIdSus) => {
  try {
    const endpoint = "/usuarios/novosresumo?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getResumoPerfilDeAtendimentos = async (municipioIdSus) => {
  try {
    const endpoint = "/atendimentosindividuais/caps/perfil/resumo?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getPerfilDeAtendimentos = async (municipioIdSus) => {
  try {
    const endpoint = "/atendimentosindividuais/caps/perfil?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosPorCaps = async (municipioIdSus) => {
  try {
    const endpoint = "/atendimentosindividuais/porcaps?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};
