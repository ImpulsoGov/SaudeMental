const aggregateByConduta = (encaminhamentos) => {
  const aggregatedEncaminhamentos = [];

  encaminhamentos.forEach((encaminhamento) => {
    const { conduta, competencia, periodo, quantidade_registrada: quantidadeRegistrada } = encaminhamento;
    const foundEncaminhamento = aggregatedEncaminhamentos.find((item) => item.conduta === conduta);

    if (!foundEncaminhamento) {
      aggregatedEncaminhamentos.push({
        conduta,
        quantidadesPorPeriodo: [{ competencia, periodo, quantidadeRegistrada }]
      });
    } else {
      foundEncaminhamento.quantidadesPorPeriodo.push({ competencia, periodo, quantidadeRegistrada });
    }
  });

  return aggregatedEncaminhamentos;
};

const orderByCompetencia = (encaminhamentos) => {
  return encaminhamentos.map(({ conduta, quantidadesPorPeriodo }) => ({
    conduta,
    quantidadesPorPeriodo: quantidadesPorPeriodo
      .sort((a, b) => new Date(a.competencia) - new Date(b.competencia))
  }));
};

const getEncaminhamentosChartOptions = (encaminhamentos) => {
  const aggregatedEncaminhamentos = aggregateByConduta(encaminhamentos);
  const orderedEncaminhamentos = orderByCompetencia(aggregatedEncaminhamentos);

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: orderedEncaminhamentos.map(({ conduta }) => conduta),
      textStyle: {
        fontSize: 14,
        fontWeight: 500,
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: "Salvar como imagem",
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: orderedEncaminhamentos[0].quantidadesPorPeriodo.map(({ periodo }) => periodo)
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: orderedEncaminhamentos[1].conduta,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: orderedEncaminhamentos[1].quantidadesPorPeriodo.map(({ quantidadeRegistrada }) => quantidadeRegistrada),
        itemStyle: {
          color: "#8F92FF"
        },
      },
      {
        name: orderedEncaminhamentos[0].conduta,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: orderedEncaminhamentos[0].quantidadesPorPeriodo.map(({ quantidadeRegistrada }) => quantidadeRegistrada),
        itemStyle: {
          color: "#CACCFE"
        },
      }
    ]
  };

  return options;
};

export { getEncaminhamentosChartOptions };
