import {
  CORES_GRAFICO_DONUT,
  QUANTIDADE_CORES_GRAFICO_DONUT,
  VALOR_LIMITE_FATIA_GRAFICO_DONUT
} from "../constants/GRAFICO_DONUT";

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

export const agruparQuantidadesPequenas = (dados) => {
  const dadosAgrupados = [];
  const fatiaDeAgrupamento = {
    condicaoSaude: 'Outros',
    quantidade: 0
  };

  dados.forEach((dado, index) => {
    if (index >= QUANTIDADE_CORES_GRAFICO_DONUT - 1) {
      fatiaDeAgrupamento.quantidade += dado.quantidade;
    } else {
      dadosAgrupados.push(dado);
    }
  });

  dadosAgrupados.push(fatiaDeAgrupamento);

  return dadosAgrupados;
};

export const getOpcoesGraficoCID = (dados) => {
  let dadosDeCid = dados;

  if (dados.length > QUANTIDADE_CORES_GRAFICO_DONUT) {
    dadosDeCid = agruparQuantidadesPequenas(dados);
  }

  return {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
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
        data: dadosDeCid.map(({ condicaoSaude, quantidade }, index) => ({
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
