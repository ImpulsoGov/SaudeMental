import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import { agruparPorConduta, ordenarPorCompetencia } from '../../helpers/getEncaminhamentosChartOptions';

const GraficoEncaminhamentos = ({ dados }) => {
  const dadosAgrupadosEOrdenados = useMemo(() => {
    const dadosAgrupados = agruparPorConduta(dados);
    const ordenadosPorCondutaDescrecente = dadosAgrupados
      .sort((a, b) => b.conduta.localeCompare(a.conduta));

    return ordenarPorCompetencia(ordenadosPorCondutaDescrecente);
  }, [dados]);

  const gerarOptions = useCallback(() => {
    const periodos = dadosAgrupadosEOrdenados[0].quantidadesPorPeriodo.map(({ periodo }) => periodo);
    const condutas = dadosAgrupadosEOrdenados.map(({ conduta }) => conduta);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: condutas,
        textStyle: {
          fontSize: 14,
          fontWeight: 500,
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: 'Salvar como imagem',
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: periodos
        }
      ],
      yAxis: [
        {
          type: 'log',
          logBase: 10000
        }
      ],
      series: [
        {
          name: dadosAgrupadosEOrdenados[1].conduta,
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: dadosAgrupadosEOrdenados[1].quantidadesPorPeriodo.map(({ quantidadeRegistrada }) => quantidadeRegistrada),
          itemStyle: {
            color: '#8F92FF'
          },
        },
        {
          name: dadosAgrupadosEOrdenados[0].conduta,
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: dadosAgrupadosEOrdenados[0].quantidadesPorPeriodo.map(({ quantidadeRegistrada }) => quantidadeRegistrada),
          itemStyle: {
            color: '#CACCFE'
          },
        }
      ]
    };
  }, [dadosAgrupadosEOrdenados]);

  return (
    <ReactEcharts
      option={ gerarOptions() }
      style={ { width: '100%', height: '70vh' } }
    />
  );
};

GraficoEncaminhamentos.propTypes = {
  dados: PropTypes.array,
}.isRequired;

export default GraficoEncaminhamentos;
