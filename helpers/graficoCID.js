import {
  CORES_GRAFICO_DONUT,
  QUANTIDADE_CORES_GRAFICO_DONUT
} from "../constants/GRAFICO_DONUT";

export const agregarPorCondicaoSaude = (dados, propriedadeCondicao, propriedadeQuantidade) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeCondicao]: nome
    } = dado;

    const dadoEncontrado = dadosAgregados
      .find((item) => item.nome === nome);

    if (!dadoEncontrado) {
      dadosAgregados.push({
        nome,
        quantidade
      });
    } else {
      dadoEncontrado.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};

export const agruparItensQueUltrapassamPaleta = (dados) => {
  const dadosAgrupados = [];
  const fatiaDeAgrupamento = {
    nome: 'Outros',
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
    dadosDeCid = agruparItensQueUltrapassamPaleta(dados);
  }

  return {
    tooltip: {
      trigger: 'item',
      valueFormatter: (value) => value,
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
        data: dadosDeCid.map(({ nome, quantidade }, index) => ({
          value: quantidade,
          name: !nome ? "Sem informação" : nome,
          itemStyle: {
            color: CORES_GRAFICO_DONUT[index]
          },
        }))
      }
    ]
  };
};
