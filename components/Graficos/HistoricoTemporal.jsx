import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { ordenarPorCompetencia} from '../../helpers/graficoHistoricoTemporal';

const GraficoHistoricoTemporal = ({
  dados,
  textoTooltip,
  propriedade,
  loading
}) => {
  const dadosOrdenados = useMemo(() => {
    return ordenarPorCompetencia(
      dados,
      propriedade
    );
  }, [dados, propriedade]);

  const gerarOptions = useCallback(() => ({
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
      data: dadosOrdenados.periodos
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: textoTooltip,
        data: dadosOrdenados.quantidades,
        type: 'line',
        itemStyle: {
          color: '#5367C9'
        },
      }
    ]
  }), [dadosOrdenados, textoTooltip]);

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

GraficoHistoricoTemporal.propTypes = {
  dados: PropTypes.array,
  textoTooltip: PropTypes.string,
  propriedade: PropTypes.string,
  loading: PropTypes.bool,
}.isRequired;

export default GraficoHistoricoTemporal;
