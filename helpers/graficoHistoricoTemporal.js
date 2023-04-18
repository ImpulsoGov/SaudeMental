export const getOpcoesGraficoHistoricoTemporal = (dados, propriedade, textoTooltip) => {
  const ordenadosPorCompetenciaAsc = dados
    .sort((a, b) => new Date(a.competencia) - new Date(b.competencia));

  const periodos = ordenadosPorCompetenciaAsc.map(({ periodo }) => periodo);
  const quantidades = ordenadosPorCompetenciaAsc
    .map((item) => item[propriedade]);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          backgroundColor: '#6a7985'
        }
      }
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
    xAxis: {
      type: 'category',
      data: periodos
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: textoTooltip,
        data: quantidades,
        type: 'line',
        itemStyle: {
          color: "#5367C9"
        },
      }
    ]
  };
};
