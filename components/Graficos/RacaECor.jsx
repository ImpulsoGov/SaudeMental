import { agregarPorRacaCor} from '../../helpers/graficoRacaECor';
import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { gerarGraficoSemDados } from '../../utils/gerarGraficoSemDados';
const GraficoRacaECor = ({
  dados,
  propriedades,
  textoTooltip,
  loading
}) => {
  const dadosAgregadosEOrdenados = useMemo(() => {
    const dadosAgregados = agregarPorRacaCor(dados,
      propriedades.racaCor,
      propriedades.quantidade
    );

    return dadosAgregados.sort((a, b) => b.racaCor.localeCompare(a.racaCor));
  }, [dados, propriedades]);
  const possuiDados = dados.length > 0;
  const gerarOptions = useCallback(() => ({
    legend: {},
    tooltip: {},
    xAxis: {
      type: 'category',
      data: dadosAgregadosEOrdenados.map((item) => item.racaCor)
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        name: textoTooltip,
        data: dadosAgregadosEOrdenados.map((item) => item.quantidade),
        itemStyle: {
          color: '#5367C9'
        },
      },
    ]
  }), [dadosAgregadosEOrdenados, textoTooltip]);

  return (
    <>
      { loading
        ? <Spinner theme='ColorSM' height='70vh' />
        : <ReactEcharts
          option={ possuiDados? gerarOptions() : gerarGraficoSemDados() }
          style={ { width: '100%', height: '70vh' } }
        />
      }
    </>
  );
};

GraficoRacaECor.propTypes = {
  dados: PropTypes.array,
  textoTooltip: PropTypes.string,
  propriedades: PropTypes.shape({
    quantidade: PropTypes.string,
    racaCor: PropTypes.string
  }),
  loading: PropTypes.bool,
}.isRequired;

export default GraficoRacaECor;
