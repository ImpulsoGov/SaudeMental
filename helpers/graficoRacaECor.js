export const agregarPorRacaCor = (
  dados,
  propriedadeRacaCor,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeRacaCor]: racaCor
    } = dado;
    const racaCorDados = dadosAgregados
      .find((item) => item.racaCor === racaCor);

    if (!racaCorDados) {
      dadosAgregados.push({
        racaCor,
        quantidade
      });
    } else {
      racaCorDados.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};

export const getOpcoesGraficoRacaEcor = (dados, textoTooltip) => {
  const NOME_DIMENSAO = "quantidade";
  const LABEL_DIMENSAO = textoTooltip;

  return {
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: [NOME_DIMENSAO, LABEL_DIMENSAO],
      source: dados
        .sort((a, b) => b.racaCor.localeCompare(a.racaCor))
        .map((item) => ({
          [NOME_DIMENSAO]: item.racaCor,
          [LABEL_DIMENSAO]: item.quantidade,
        })),
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        itemStyle: {
          color: "#5367C9"
        },
      },
    ]
  };
};
