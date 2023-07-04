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

export const getProcedimentosPorTempoServico = async (municipioIdSus) => {
  try {
    const endpoint = "/procedimentos_por_usuario_tempo?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getProcedimentosPorEstabelecimento = async (municipioIdSus) => {
  try {
    const endpoint = "/procedimentos_por_usuario_estabelecimentos?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getResumoProcedimentosPorTempoServico = async (municipioIdSus) => {
  try {
    const endpoint = "/procedimentos_por_usuario_resumo?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAbandonoMensal = async (municipioIdSus) => {
  try {
    const endpoint = "/abandono/mensal?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getPerfilAbandono = async (municipioIdSus) => {
  try {
    const endpoint = "/abandono/resumo?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAbandonoCoortes = async (municipioIdSus) => {
  try {
    const endpoint = "/abandono/coortes?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getProcedimentosPorTipo = async (municipioIdSus) => {
  try {
    const endpoint = "/procedimentos_por_tipo?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getProcedimentosPorHora = async (municipioIdSus) => {
  try {
    const endpoint = "/procedimentos_por_hora?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getUsuariosAtivosPorCondicao = async (
  municipioIdSus,
  estabelecimento,
  periodo
) => {
  try {
    const endpoint = "/usuarios/perfil/condicao?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodo=" + periodo;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getUsuariosAtivosPorGeneroEIdade = async (
  municipioIdSus,
  estabelecimento,
  periodo
) => {
  try {
    const endpoint = "/usuarios/perfil/genero-e-idade?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodo=" + periodo;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getUsuariosAtivosPorRacaECor = async (
  municipioIdSus,
  estabelecimento,
  periodo
) => {
  try {
    const endpoint = "/usuarios/perfil/raca?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodo=" + periodo;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getUsuariosAtivosPorCID = async (
  municipioIdSus,
  estabelecimento,
  periodo
) => {
  try {
    const endpoint = "/usuarios/perfil/cid?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodo=" + periodo;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getEstabelecimentosPerfil = async (municipioIdSus) => {
  try {
    const endpoint = `/usuarios/perfil/estabelecimentos?municipio_id_sus=${municipioIdSus}`;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getPeriodosPerfil = async (municipioIdSus) => {
  try {
    const endpoint = `/usuarios/perfil/periodos?municipio_id_sus=${municipioIdSus}`;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getResumoTotaisMunicipio = async (municipioIdSus) => {
  try {
    const endpoint = `/resumo/caps?municipio_id_sus=${municipioIdSus}`;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getUsuariosNovosPorCondicao = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/usuarios/novos/condicao?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getUsuariosNovosPorGeneroEIdade = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/usuarios/novos/genero-e-idade?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getUsuariosNovosPorRacaECor = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/usuarios/novos/raca?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getUsuariosNovosPorCID = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/usuarios/novos/cid?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getEstabelecimentos = async (municipioIdSus, entidade) => {
  try {
    const endpoint = `/estabelecimentos?municipio_id_sus=${municipioIdSus}&entidade=${entidade}`;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getPeriodos = async (municipioIdSus, entidade) => {
  try {
    const endpoint = `/periodos?municipio_id_sus=${municipioIdSus}&entidade=${entidade}`;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};
