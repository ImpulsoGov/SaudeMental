import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { agruparPorTempoDeServico, getMediaProcedimentosPorPeriodo, ordenarPorTempoDeServico } from '../../helpers/graficoProcedimentosPorTempoServico';
import { gerarGraficoSemDados } from '../../utils/gerarGraficoSemDados';
const GraficoProcedimentosPorTempoServico = ({ dados, textoTooltip }) => {
  const dadosAgrupados = useMemo(() => {
    return agruparPorTempoDeServico(dados);
  }, [dados]);

  const dadosAgrupadosEOrdenados = useMemo(() => {
    return ordenarPorTempoDeServico(dadosAgrupados);
  }
  , [dadosAgrupados]);
  const possuiDados = dados.length > 0;
  const gerarOptions = useCallback(() => {
    return {
      tooltip: {},
      xAxis: {
        type: 'category',
        data: dadosAgrupadosEOrdenados.map(({ tempoServico }) => tempoServico)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: dadosAgrupadosEOrdenados.map(({ procedimentosPorPeriodo }) =>
            getMediaProcedimentosPorPeriodo(procedimentosPorPeriodo).toFixed(2)),
          type: 'bar',
          name: textoTooltip
        }
      ]
    };
  }, [dadosAgrupadosEOrdenados, textoTooltip]);

  return (
    <ReactEcharts
      option={ possuiDados? gerarOptions() : gerarGraficoSemDados() }
      style={ { width: '100%', height: '70vh' } }
    />
  );
};

GraficoProcedimentosPorTempoServico.propTypes = {
  dados: PropTypes.array,
  textoTooltip: PropTypes.string
}.isRequired;

export default GraficoProcedimentosPorTempoServico;
