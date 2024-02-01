import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { agregarPorFaixaEtariaEGenero } from '../../helpers/graficoGeneroEFaixaEtaria';
import { gerarGraficoSemDados } from '../../utils/gerarGraficoSemDados';
const NOME_DIMENSAO = 'faixa etaria';
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
  const possuiDados = dados.length > 0;
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
          [LABELS_DIMENSAO[0]]: item[LABELS_DIMENSAO[0].toLowerCase()] || 0,
          [LABELS_DIMENSAO[1]]: item[LABELS_DIMENSAO[1].toLowerCase()] || 0,
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
        Name: LABELS_DIMENSAO[0],
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
        Name: LABELS_DIMENSAO[1],
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
          option={ possuiDados? gerarOptions() : gerarGraficoSemDados() }
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
