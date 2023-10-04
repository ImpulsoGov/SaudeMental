import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { agregarPorFaixaEtariaEGenero } from '../../helpers/graficoGeneroEFaixaEtaria';
const NOME_DIMENSAO = 'genero';
const LABELS_DIMENSAO = ['Masculino', 'Feminino'];

const GraficoGeneroPorFaixaEtaria = ({
  dados,
  labels,
  propriedades,
  loading
}) => {
  const dadosAgregados = useMemo(() => {
    return agregarPorFaixaEtariaEGenero(
      dados,
      propriedades.faixaEtaria,
      propriedades.sexo,
      propriedades.quantidade
    );
  }, [dados, propriedades]);

  const gerarOptions = useCallback(() => ({
    legend: {
      itemGap: 25,
    },
    tooltip: {},
    dataset: {
      dimensions: [NOME_DIMENSAO, ...LABELS_DIMENSAO],
      source: dadosAgregados
        .sort((a, b) => a.faixaEtaria.localeCompare(b.faixaEtaria))
        .map((item) => ({
          [NOME_DIMENSAO]: item.faixaEtaria,
          [LABELS_DIMENSAO[0]]: item[LABELS_DIMENSAO[0].toLowerCase()],
          [LABELS_DIMENSAO[1]]: item[LABELS_DIMENSAO[1].toLowerCase()],
        })),
    },
    xAxis: {
      type: 'category',
      name: 'Faixa etária (em anos)',
      nameLocation: 'center',
      nameGap: 45,
    },
    yAxis: {
      name: labels.eixoY,
      nameLocation: 'center',
      nameGap: 55,
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          color: '#FA81E6'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: `{@${LABELS_DIMENSAO[0]}}`,
          color: '#FFFFFF',
        },
      },
      {
        type: 'bar',
        itemStyle: {
          color: '#5367C9'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: `{@${LABELS_DIMENSAO[1]}}`,
          color: '#FFFFFF',
        },
      }
    ]
  }), [dadosAgregados, labels]);

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

GraficoGeneroPorFaixaEtaria.propTypes = {
  dados: PropTypes.array,
  labels: PropTypes.shape({
    eixoY: PropTypes.string,
  }),
  propriedades: PropTypes.shape({
    quantidade: PropTypes.string,
    faixaEtaria: PropTypes.string,
    sexo: PropTypes.string,
  }),
  loading: PropTypes.bool,
}.isRequired;

export default GraficoGeneroPorFaixaEtaria;
