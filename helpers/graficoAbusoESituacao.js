import { CORES_GRAFICO_SUBST_MORADIA } from "../constants/CORES_GRAFICO_SUBST_MORADIA";

export const agregarPorAbusoSubstancias = (
  dados,
  propriedadeAbusoSubstancia,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeAbusoSubstancia]: abusoSubstancias
    } = dado;
    const abusoSubstanciasDados = dadosAgregados
      .find((item) => item.abusoSubstancias === abusoSubstancias);

    if (!abusoSubstanciasDados) {
      dadosAgregados.push({
        abusoSubstancias,
        quantidade
      });
    } else {
      abusoSubstanciasDados.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};

export const agregarPorSituacaoRua = (
  dados,
  propriedadeSituacaoRua,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeSituacaoRua]: situacaoRua,
    } = dado;
    const situacaoRuaDados = dadosAgregados
      .find((item) => item.situacaoRua === situacaoRua);

    if (!situacaoRuaDados) {
      dadosAgregados.push({
        situacaoRua,
        quantidade
      });
    } else {
      situacaoRuaDados.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};

export const getOpcoesGraficoAbusoESituacao = (dados, titulo, tipo) => {
  const PROPIEDADES_POR_TIPO = {
    SITUACAO_RUA: "situacaoRua",
    ABUSO_SUBSTANCIAS: "abusoSubstancias"
  };

  const propriedade = PROPIEDADES_POR_TIPO[tipo];

  return {
    title: {
      text: titulo,
      textStyle: {
        fontSize: 14
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: 0
    },
    series: [
      {
        top: 30,
        bottom: 30,
        name: titulo,
        type: 'pie',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'inside',
          formatter: "{d}%",
          color: "#000000"
        },
        emphasis: {
          label: {
            show: true,
          }
        },
        labelLine: {
          show: false
        },
        data: dados.map((item, index) => ({
          value: item.quantidade,
          name: item[propriedade],
          itemStyle: {
            color: CORES_GRAFICO_SUBST_MORADIA[index]
          },
        }))
      }
    ]
  };
};
