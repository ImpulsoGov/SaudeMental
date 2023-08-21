import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FiltroCompetencia, FiltroTexto } from '../Filtros';
import styles from './Graficos.module.css';
import { agregarPorFaixaEtariaEGenero } from '../../helpers/graficoGeneroEFaixaEtaria';

const NOME_DIMENSAO = 'genero';
const LABELS_DIMENSAO = ['Masculino', 'Feminino'];

const GraficoGeneroPorFaixaEtaria = ({
  dados,
  labels,
  propriedades,
  filtroEstabelecimento,
  filtroCompetencia,
  loading
}) => {
  const dadosFiltrados = useMemo(() => {
    const periodosSelecionados = filtroCompetencia.multiSelecao
      ? filtroCompetencia.selecionado.map(({ value }) => value)
      : [filtroCompetencia.selecionado.value];

    return dados.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.selecionado.value
      && periodosSelecionados.includes(item.periodo)
    );
  }, [dados, filtroCompetencia, filtroEstabelecimento]);

  const dadosAgregados = useMemo(() => {
    return agregarPorFaixaEtariaEGenero(
      dadosFiltrados,
      propriedades.faixaEtaria,
      propriedades.sexo,
      propriedades.quantidade
    );
  }, [dadosFiltrados, propriedades]);

  const optionsGrafico = useMemo(() => ({
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
      <div className={ styles.Filtros }>
        <FiltroTexto
          dados={ filtroEstabelecimento.opcoes }
          label='Estabelecimento'
          propriedade='estabelecimento'
          valor={ filtroEstabelecimento.selecionado }
          setValor={ filtroEstabelecimento.setFiltro }
        />

        <FiltroCompetencia
          dados={ filtroCompetencia.opcoes }
          valor={ filtroCompetencia.selecionado }
          setValor={ filtroCompetencia.setFiltro }
          isMulti={ filtroCompetencia.multiSelecao }
        />
      </div>

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
  filtroEstabelecimento: PropTypes.shape({
    selecionado: PropTypes.shape({ value: PropTypes.string }),
    setFiltro: PropTypes.func,
    opcoes: PropTypes.arrayOf(PropTypes.string),
  }),
  filtroCompetencia: PropTypes.shape({
    selecionado: PropTypes.oneOfType([
      PropTypes.shape({ value: PropTypes.string }),
      PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string }))
    ]),
    setFiltro: PropTypes.func,
    opcoes: PropTypes.arrayOf(PropTypes.string),
    multiSelecao: PropTypes.bool,
  }),
  loading: PropTypes.bool,
}.isRequired;

export default GraficoGeneroPorFaixaEtaria;
