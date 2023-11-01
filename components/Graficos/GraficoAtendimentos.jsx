import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';

const GraficoAtendimentos = ({
  dados,
  textoTooltipA,
  textoTooltipB,
  propriedade,
  loading
}) => {
  const dadosOrdenados = useMemo(() => {
    return dados.sort((a,b) => new Date(a.competencia) - new Date(b.competencia));
  }, [dados]);

  const periodosUnicos = useMemo(() => {
    return dadosOrdenados
      .filter((item) => item.ocupacao === textoTooltipA)
      .map((item) => item.periodo);
  }, [dadosOrdenados, textoTooltipA]);

  const procedimentosA = useMemo(() => {
    return dadosOrdenados.filter((item => item.ocupacao === textoTooltipA)).map((item) => item[propriedade]);
  }, [dadosOrdenados, propriedade, textoTooltipA]);

  const procedimentosB = useMemo(() => {
    return dadosOrdenados.filter((item => item.ocupacao === textoTooltipB)).map((item) => item[propriedade]);
  }, [dadosOrdenados, propriedade, textoTooltipB]);

  const gerarOptions = useCallback(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: [textoTooltipA, textoTooltipB], //A = Médico psiquiatra, B = Psicólogo clínico
      textStyle: {
        fontSize: 14,
        fontWeight: 500,
      },
      left:'0.5%'
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
      data: periodosUnicos
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name  : textoTooltipA,
        data: procedimentosA,
        type: 'line',
        itemStyle: {
          color: '#5367C9'
        },
      },
      {
        name: textoTooltipB,
        data: procedimentosB,
        type: 'line',
        itemStyle: {
          color: '#FA81E6'
        },
      }
    ]
  }), [textoTooltipA, textoTooltipB, periodosUnicos, procedimentosA, procedimentosB]);

  return (
    <>
      { loading
        ? <Spinner theme='ColorSM' height='70vh' />
        : <ReactEcharts
          option={ gerarOptions() }
          style={ { width: '100%', height: '70vh' } }
        />
      }
    </>
  );
};

GraficoAtendimentos.propTypes = {
  dados: PropTypes.array,
  textoTooltipA: PropTypes.string,
  textoTooltipB: PropTypes.string,
  propriedade: PropTypes.string,
  loading: PropTypes.bool,
}.isRequired;

export default GraficoAtendimentos;
