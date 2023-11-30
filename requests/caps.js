import axios from "axios";
import { API_SAUDE_MENTAL_URL } from "../constants/API_URL";
import { addQueryParamSeExiste } from '../utils/addQueryParamSeExiste';
const axiosInstance = axios.create({
  baseURL: `${API_SAUDE_MENTAL_URL}saude-mental`,
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

export const obterPerfilUsuariosPorEstabelecimento = async ({
  municipioIdSus,
  estabelecimentos,
  periodos,
  estabelecimento_linha_perfil,
  estabelecimento_linha_idade
}) => {
  try {
    let endpoint = "/usuarios/perfil/por-estabelecimento?municipio_id_sus=" + municipioIdSus;
    const parametrosOpcionais = {
      periodos,
      estabelecimentos,
      estabelecimento_linha_perfil,
      estabelecimento_linha_idade
    };

    for (const parametro in parametrosOpcionais) {
      if (parametrosOpcionais[parametro] !== undefined) {
        endpoint += `&${parametro}=${parametrosOpcionais[parametro]}`;
      }
    }

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const obterResumoNovosUsuarios = async ({
  municipioIdSus,
  estabelecimentos,
  periodos,
  estabelecimento_linha_perfil,
  estabelecimento_linha_idade
}) => {
  try {
    let endpoint = "/usuarios/novos/resumo?municipio_id_sus=" + municipioIdSus;
    const parametrosOpcionais = {
      periodos,
      estabelecimentos,
      estabelecimento_linha_perfil,
      estabelecimento_linha_idade
    };

    for (const parametro in parametrosOpcionais) {
      if (parametrosOpcionais[parametro] !== undefined) {
        endpoint += `&${parametro}=${parametrosOpcionais[parametro]}`;
      }
    }

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

export const getAtendimentosPorCaps = async (municipioIdSus) => {
  try {
    const endpoint = "/atendimentosindividuais/porcaps?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const obterProcedimentosPorEstabelecimento = async ({
  municipioIdSus,
  estabelecimentos,
  periodos,
  estabelecimento_linha_perfil,
  estabelecimento_linha_idade
}) => {
  try {
    const endpoint = "/procedimentos_por_usuario_estabelecimentos?municipio_id_sus=" + municipioIdSus;
    const parametrosOpcionais = {
      periodos,
      estabelecimentos,
      estabelecimento_linha_perfil,
      estabelecimento_linha_idade
    };

    for (const parametro in parametrosOpcionais) {
      if (parametrosOpcionais[parametro] !== undefined) {
        endpoint += `&${parametro}=${parametrosOpcionais[parametro]}`;
      }
    }

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

export const getAbandonoCoortes = async ({
  municipioIdSus,
  periodos,
  estabelecimentos
}) => {
  try {
    let endpoint = '/abandono/coortes?municipio_id_sus=' + municipioIdSus;
    endpoint = addQueryParamSeExiste(endpoint, 'periodos', periodos);
    endpoint = addQueryParamSeExiste(endpoint, 'estabelecimentos', estabelecimentos);

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

export const getAtendimentosPorGeneroEIdade = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/atendimentosindividuais/genero-e-idade?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosPorRacaECor = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/atendimentosindividuais/raca?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosPorCID = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/atendimentosindividuais/cid?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getEvasoesNoMesPorCID = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/abandono/evadiram-no-mes/cid?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getEvasoesNoMesPorGeneroEIdade = async (
  municipioIdSus,
  estabelecimento,
  periodos
) => {
  try {
    const endpoint = "/abandono/evadiram-no-mes/genero-e-idade?municipio_id_sus=" + municipioIdSus
      + "&estabelecimento=" + estabelecimento
      + "&periodos=" + periodos;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const obterProcedimentosPorTempoServico = async ({
  municipioIdSus,
  estabelecimentos,
  periodos
}) => {
  try {
    let endpoint = `/procedimentos-por-usuario-tempo?municipio_id_sus=${municipioIdSus}`;

    if (estabelecimentos !== undefined) {
      endpoint += `&estabelecimentos=${estabelecimentos}`;
    }

    if (periodos !== undefined) {
      endpoint += `&periodos=${periodos}`;
    }

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const obterProcedimentosPorHora = async ({
  municipioIdSus,
  estabelecimentos,
  periodos,
  ocupacao
}) => {
  try {
    let endpoint = `/procedimentos-por-hora?municipio_id_sus=${municipioIdSus}`;

    if (estabelecimentos !== undefined) {
      endpoint += `&estabelecimentos=${estabelecimentos}`;
    }

    if (periodos !== undefined) {
      endpoint += `&periodos=${periodos}`;
    }

    if (ocupacao !== undefined) {
      endpoint += `&ocupacao=${ocupacao}`;
    }

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const obterProcedimentosPorTipo = async ({
  municipioIdSus,
  estabelecimentos,
  periodos,
  procedimentos
}) => {
  try {
    let endpoint = `/procedimentos-por-tipo?municipio_id_sus=${municipioIdSus}`;

    if (estabelecimentos !== undefined) {
      endpoint += `&estabelecimentos=${estabelecimentos}`;
    }

    if (periodos !== undefined) {
      endpoint += `&periodos=${periodos}`;
    }

    if (procedimentos !== undefined) {
      endpoint += `&procedimentos=${procedimentos}&periodos=${periodos}`;
    }

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const obterNomesDeProcedimentosPorTipo = async (municipioIdSus) => {
  try {
    const endpoint = `/procedimentos-por-tipo/procedimentos?municipio_id_sus=${municipioIdSus}`;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};
