import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import {agregarPorPropriedadeESomarQuantidade, getSomaQuantidadesPorPeriodo} from '../../helpers/graficoBarrasProducao';
import {gerarGraficoSemDados} from '../../utils/gerarGraficoSemDados';
const GraficoBarrasProducao = ({
  dados,
  textoTooltip,
  propriedades,
  loading
}) => {
  const dadosAgregados = useMemo(() => {
    return agregarPorPropriedadeESomarQuantidade(
      dados,
      propriedades.agregacao,
      propriedades.quantidade
    );
  }, [dados, propriedades]);
  const possuiDados = dados.length > 0;
  const gerarOptions = useCallback(() => ({
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
      data: dadosAgregados.map(({ propriedade }) => propriedade)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: dadosAgregados.map(({ quantidadesPorPeriodo }) =>
          getSomaQuantidadesPorPeriodo(quantidadesPorPeriodo)),
        type: 'bar',
        name: textoTooltip
      }
    ]

  }), [dadosAgregados, textoTooltip]);
  return (
    <>
      { loading
        ? <Spinner theme='ColorSM' height='70vh' />
        : <ReactEcharts
          notMerge = { true }
          option={ possuiDados? gerarOptions() : gerarGraficoSemDados() }
          style={ { width: '100%', height: '70vh' } }
        />
      }
    </>
  );
};

GraficoBarrasProducao.propTypes = {
  dados: PropTypes.array,
  textoTooltip: PropTypes.string,
  propriedades: PropTypes.shape({
    agregacao: PropTypes.string,
    quantidade: PropTypes.string,
  }),
  loading: PropTypes.bool,
}.isRequired;
export default GraficoBarrasProducao;
