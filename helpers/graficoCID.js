import { CORES_GRAFICO_DONUT } from "../constants/CORES_GRAFICO_DONUT";

export const agregarPorCondicaoSaude = (dados, propriedadeCondicao, propriedadeQuantidade) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeCondicao]: condicaoSaude
    } = dado;

    const condicaoSaudeDados = dadosAgregados
      .find((item) => item.condicaoSaude === condicaoSaude);

    if (!condicaoSaudeDados) {
      dadosAgregados.push({
        condicaoSaude,
        quantidade
      });
    } else {
      condicaoSaudeDados.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};

export const getOpcoesGraficoCID = (dados) => {
  return {
    tooltip: {
      trigger: 'item',
    },
    // legend: {
    //   show: true,
    //   orient: 'vertical',
    //   right: 0,
    //   top: 0
    // },
    series: [
      {
        type: 'pie',
        radius: ['40%', '80%'],
        // top: 0,
        // left: 0,
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
        data: dados.map(({ condicaoSaude, quantidade }, index) => ({
          value: quantidade,
          name: !condicaoSaude ? "Sem informação" : condicaoSaude,
          itemStyle: {
            color: CORES_GRAFICO_DONUT[index]
          },
        }))
      }
    ]
  };
};
