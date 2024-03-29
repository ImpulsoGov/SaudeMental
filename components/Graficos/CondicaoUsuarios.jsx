import { Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { CORES_GRAFICO_SUBST_MORADIA } from '../../constants/CORES_GRAFICO_SUBST_MORADIA';
import { agregarQuantidadePorPropriedadeNome } from '../../helpers/graficoDonut';
import { removerDadosZeradosPorPropriedade } from '../../utils/removerDadosZerados';
import { gerarGraficoSemDados } from '../../utils/gerarGraficoSemDados';
const GraficoCondicaoUsuarios = ({
  dados,
  propriedades,
  loading,
  titulo,
  textoTooltip
}) => {
  const dadosAgregados = useMemo(() => {
    const dadosNaoZerados = removerDadosZeradosPorPropriedade(dados, propriedades.quantidade);
    return agregarQuantidadePorPropriedadeNome(
      dadosNaoZerados,
      propriedades.nome,
      propriedades.quantidade
    );
  }, [dados, propriedades]);
  const possuiDados = dados.length > 0;
  const gerarOptions = useCallback(() => {
    return {
      title: {
        text: titulo,
        textStyle: {
          fontSize: 14
        },
      },
      tooltip: {
        trigger: 'item',
        valueFormatter: (value) => value,
      },
      legend: {
        bottom: 0
      },
      series: [
        {
          top: 30,
          bottom: 30,
          name: textoTooltip,
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
          data: dadosAgregados.map((item, index) => ({
            value: item.quantidade,
            name: item.nome,
            itemStyle: {
              color: CORES_GRAFICO_SUBST_MORADIA[index]
            },
          }))
        }
      ]
    };
  }, [dadosAgregados, titulo, textoTooltip]);

  return (
    <>
      {loading
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

GraficoCondicaoUsuarios.propTypes = {
  dados: PropTypes.array,
  propriedades: PropTypes.shape({
    nome: PropTypes.string,
    quantidade: PropTypes.string,
  }),
  loading: PropTypes.bool,
  titulo: PropTypes.string,
  textoTooltip: PropTypes.string,
}.isRequired;

export default GraficoCondicaoUsuarios;
