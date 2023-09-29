import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { CORES_GRAFICO_DONUT, QUANTIDADE_CORES_GRAFICO_DONUT } from '../../constants/GRAFICO_DONUT';
import { agregarQuantidadePorPropriedadeNome, agruparItensQueUltrapassamPaleta } from '../../helpers/graficoDonut';
import { ordenarDecrescentePorPropriedadeNumerica } from '../../utils/ordenacao';
import { removerDadosZeradosPorPropriedade } from '../../utils/removerDadosZerados';

const GraficoDonut = ({ dados, propriedades, loading }) => {
  const dadosAgregadosEOrdenados = useMemo(() => {
    const dadosNaoZerados = removerDadosZeradosPorPropriedade(dados, propriedades.quantidade);
    const agregados = agregarQuantidadePorPropriedadeNome(
      dadosNaoZerados,
      propriedades.nome,
      propriedades.quantidade
    );

    return ordenarDecrescentePorPropriedadeNumerica(
      agregados,
      'quantidade'
    );
  }, [dados, propriedades]);

  const gerarOptions = useCallback(() => {
    let dadosGraficoDonut = dadosAgregadosEOrdenados;

    if (dadosAgregadosEOrdenados.length > QUANTIDADE_CORES_GRAFICO_DONUT) {
      dadosGraficoDonut = agruparItensQueUltrapassamPaleta(dadosAgregadosEOrdenados);
    }

    return {
      tooltip: {
        trigger: 'item',
        valueFormatter: (value) => value,
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            color: '#000000'
          },
          emphasis: {
            label: {
              show: true,
            }
          },
          labelLine: {
            show: false
          },
          data: dadosGraficoDonut.map(({ nome, quantidade }, index) => ({
            value: quantidade,
            name: !nome ? 'Sem informação' : nome,
            itemStyle: {
              color: CORES_GRAFICO_DONUT[index]
            },
          }))
        }
      ]
    };
  }, [dadosAgregadosEOrdenados]);

  return (
    <>
      { loading
        ? <Spinner theme='ColorSM' height='70vh' />
        : <ReactEcharts
          option={ gerarOptions() }
          style={ { width: '50%', height: '70vh' } }
        />
      }
    </>
  );
};

export default GraficoDonut;

GraficoDonut.defaultProps = {
  loading: false
};

GraficoDonut.propTypes = {
  dados: PropTypes.array.isRequired,
  propriedades: PropTypes.shape({
    nome: PropTypes.string,
    quantidade: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool
};
