import axios from "axios";
import { API_SAUDE_MENTAL_URL } from "../constants/API_URL";

const axiosInstance = axios.create({
  baseURL: `${API_SAUDE_MENTAL_URL}saude-mental`,
});

export const getCAPSAcolhimentoNoturno = async (municipioIdSus) => {
  try {
    const endpoint = "/atencao_hospitalar/noturno?municipio_id_sus=" + municipioIdSus;
    const { data } = await axiosInstance.get(endpoint);
    return data;
  }  catch (error) {
    console.log('error', error.response.data);
  }
};
export const getInternacoesRapsAltas = async (municipioIdSus) => {
  try {
    const endpoint = "/atencao_hospitalar/altas?municipio_id_sus=" + municipioIdSus;
    const { data } = await axiosInstance.get(endpoint);
    return data;
  }  catch (error) {
    console.log('error', error.response.data);
  }
};
export const getInternacoesRapsAdmissoes = async (municipioIdSus) => {
  try {
    const endpoint = "/internacoes/raps/admissoes/resumo/12m?municipio_id_sus=" + municipioIdSus;
    const { data } = await axiosInstance.get(endpoint);
    return data;
  }  catch (error) {
    console.log('error', error.response.data);
  }
};
export const getInternacoesRapsAltas12m = async (municipioIdSus) => {
  try {
    const endpoint = "/internacoes/raps/altas/resumo/12m?municipio_id_sus=" + municipioIdSus;
    const { data } = await axiosInstance.get(endpoint);
    return data;
  }  catch (error) {
    console.log('error', error.response.data);
  }
};
