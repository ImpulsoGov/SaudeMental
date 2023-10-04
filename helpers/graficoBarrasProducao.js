export const agregarPorPropriedadeESomarQuantidade = (
  dados,
  propriedadeAgregacao,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((item) => {
    const {
      periodo,
      [propriedadeAgregacao]: propriedade,
      [propriedadeQuantidade]: quantidade
    } = item;
    const propriedadeEncontrada = dadosAgregados
      .find((item) => item.propriedade === propriedade);

    if (!propriedadeEncontrada) {
      dadosAgregados.push({
        propriedade,
        quantidadesPorPeriodo: [{
          periodo,
          quantidade
        }]
      });
    } else {
      propriedadeEncontrada.quantidadesPorPeriodo.push({
        periodo,
        quantidade
      });
    }
  });

  return dadosAgregados;
};

export const getSomaQuantidadesPorPeriodo = (quantidadesPorPeriodo) => {
  return quantidadesPorPeriodo
    .reduce((acc, { quantidade }) =>
      acc + quantidade,
    0);
};

export const getOpcoesGraficoBarrasProducao = (dados, textoTooltip) => {
  return {
    legend: {
      show: true
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      axisLabel: {
        rotate: 35,
        width: 100,
        overflow: 'break',
        formatter: (value) => value.length > 10
          ? `${value.slice(0, 10)}...`
          : value
      },
      data: dados.map(({ propriedade }) => propriedade)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: dados.map(({ quantidadesPorPeriodo }) =>
          getSomaQuantidadesPorPeriodo(quantidadesPorPeriodo)),
        type: 'bar',
        name: textoTooltip
      }
    ]
  };
};
