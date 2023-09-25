import { agregarPorRacaCor} from '../../helpers/graficoRacaECor';
import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
const NOME_DIMENSAO = 'quantidade';

const GraficoRacaECor = ({
  dados,
  propriedades,
  label,
  loading
}) => {
  const dadosAgregados = useMemo(() => {
    return agregarPorRacaCor(dados,
      propriedades.quantidade,
      propriedades.racaCor,
    );
  }, [dados, propriedades]);

  const optionsGrafico = useMemo(() => ({
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: [NOME_DIMENSAO, label],
      source: dadosAgregados
        .sort((a, b) => b.racaCor.localeCompare(a.racaCor))
        .map((item) => ({
          [NOME_DIMENSAO]: item.racaCor,
          [label]: item.quantidade,
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
          color: '#5367C9'
        },
      },
    ]
  }), [dadosAgregados, label]);

  return (
    <>
      { loading
        ? <Spinner theme='ColorSM' height='70vh' />
        : <ReactEcharts
          option={ optionsGrafico }
          style={ { width: '100%', height: '70vh' } }
        />
      }
    </>
  );
};
GraficoRacaECor.propTypes = {
  dados: PropTypes.array,
  label: PropTypes.string,
  propriedades: PropTypes.shape({
    quantidade: PropTypes.string,
    racaCor: PropTypes.string
  }),
  loading: PropTypes.bool,
}.isRequired;
export default GraficoRacaECor;