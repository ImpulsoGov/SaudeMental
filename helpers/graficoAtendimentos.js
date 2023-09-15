export const getOpcoesGraficoAtendimentos = (dados, propriedade, textoTooltipPsiquiatra, textoTooltipPsicologo) => {
  console.log(dados);
  const procedimentosOrdenadosPorCompetencia = dados.sort((a,b) => new Date(a.competencia) - new Date(b.competencia));
  const periodos = procedimentosOrdenadosPorCompetencia.map((item) => item.periodo);
  console.log('Os periodos estão:', periodos);
  const procedimentosPsiquiatra = procedimentosOrdenadosPorCompetencia.filter((item => item.ocupacao === 'Médico psiquiatra')).map((item) => item[propriedade]);
  const procedimentosPsicologo = procedimentosOrdenadosPorCompetencia.filter((item => item.ocupacao === 'Psicólogo clínico')).map((item) => item[propriedade]);
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: [textoTooltipPsiquiatra, textoTooltipPsicologo],
      textStyle: {
        fontSize: 14,
        fontWeight: 500,
      },
      left:'5%'
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Salvar como imagem',
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
      boundaryGap: true,
      data: periodos
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: textoTooltipPsiquiatra,
        data: procedimentosPsiquiatra,
        type: 'line',
        itemStyle: {
          color: '#5367C9'
        },
      },
      {
        name: textoTooltipPsicologo,
        data: procedimentosPsicologo,
        type: 'line',
        itemStyle: {
          color: '#FA81E6'
        },
      }
    ]
  };
};