import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { agruparPorTempoDeServico, getMediaProcedimentosPorPeriodo } from '../../helpers/graficoProcedimentosPorTempoServico';
import { useCallback, useMemo } from 'react';

const GraficoProcedimentosPorTempoServico = ({ dados, textoTooltip }) => {
  const dadosAgrupados = useMemo(() => {
    return agruparPorTempoDeServico(dados);
  }, [dados]);

  const gerarOptions = useCallback(() => {
    return {
      tooltip: {},
      xAxis: {
        type: 'category',
        data: dadosAgrupados.map(({ tempoServico }) => tempoServico)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: dadosAgrupados.map(({ procedimentosPorPeriodo }) =>
            getMediaProcedimentosPorPeriodo(procedimentosPorPeriodo)),
          type: 'bar',
          name: textoTooltip
        }
      ]
    };
  }, [dadosAgrupados, textoTooltip]);

  return (
    <ReactEcharts
      option={ gerarOptions() }
      style={ { width: '100%', height: '70vh' } }
    />
  );
};

GraficoProcedimentosPorTempoServico.propTypes = {
  dados: PropTypes.array,
  textoTooltip: PropTypes.string
}.isRequired;

export default GraficoProcedimentosPorTempoServico;
