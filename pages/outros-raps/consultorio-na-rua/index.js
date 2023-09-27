import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import { TabelaGraficoDonut } from '../../../components/Tabelas';
import { FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { agregarQuantidadePorPropriedadeNome, getOpcoesGraficoDonut } from '../../../helpers/graficoDonut';
import { getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from '../../../requests/outros-raps';
import { ordenarDecrescentePorPropriedadeNumerica } from '../../../utils/ordenacao';
import styles from '../OutrosRaps.module.css';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ConsultorioNaRua = () => {
  const { data: session } = useSession();
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentos12meses, setAtendimentos12meses] = useState([]);
  const [filtroProducao, setFiltroProducao] = useState({
    value: 'Todos', label: 'Todos'
  });
  const [filtroCompetencia, setFiltroCompetencia] = useState(FILTRO_PERIODO_MULTI_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendimentos(await getAtendimentosConsultorioNaRua(municipioIdSus));
      setAtendimentos12meses(
        await getAtendimentosConsultorioNaRua12meses(municipioIdSus)
      );
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const ordenarQuantidadesPorCompetenciaAsc = (atendimentos) => {
    return atendimentos.sort((a, b) => new Date(a.competencia) - new Date(b.competencia));
  };

  const getOpcoesGraficoDeLinha = (atendimentos) => {
    const atendimentosFiltrados = atendimentos.filter(({ tipo_producao: tipoProducao }) => tipoProducao === filtroProducao.value);
    const atendimentosOrdenados = ordenarQuantidadesPorCompetenciaAsc(atendimentosFiltrados);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            backgroundColor: '#6a7985'
          }
        }
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
      xAxis: {
        type: 'category',
        data: atendimentosOrdenados.map(({ periodo }) => periodo)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Atendimentos realizados',
          data: atendimentosOrdenados
            .map(({ quantidade_registrada: quantidadeRegistrada }) => quantidadeRegistrada),
          type: 'line',
          itemStyle: {
            color: '#5367C9'
          },
        }
      ]
    };
  };

  const atendimentosFiltradosOrdenados = useMemo(() => {
    const periodosSelecionados = filtroCompetencia.map(({ value }) => value);
    const atendimentosFiltrados = atendimentos.filter(({
      tipo_producao: tipoProducao,
      periodo,
      quantidade_registrada: quantidade
    }) =>
      tipoProducao !== 'Todos'
      && periodosSelecionados.includes(periodo)
      && quantidade !== 0
    );

    const atendimentosAgregados = agregarQuantidadePorPropriedadeNome(
      atendimentosFiltrados,
      'tipo_producao',
      'quantidade_registrada'
    );

    const atendimentosOrdenados = ordenarDecrescentePorPropriedadeNumerica(
      atendimentosAgregados,
      'quantidade'
    );

    return atendimentosOrdenados;
  }, [atendimentos, filtroCompetencia]);

  const getPropsCardUltimoPeriodo = () => {
    const atendimentoTodosUltimoPeriodo = atendimentos
      .find((atendimento) => atendimento.tipo_producao === 'Todos' && atendimento.periodo === 'Último período');

    return {
      key: uuidv4(),
      indicador: atendimentoTodosUltimoPeriodo['quantidade_registrada'],
      titulo: `Total de atendimentos em ${atendimentoTodosUltimoPeriodo['nome_mes']}`,
      indice: atendimentoTodosUltimoPeriodo['dif_quantidade_registrada_anterior'],
      indiceDescricao: 'últ. mês'
    };
  };

  const getPropsCardUltimos12Meses = () => {
    const atendimentoTodosUltimos12Meses = atendimentos12meses
      .find(({ tipo_producao: tipoProducao }) => tipoProducao === 'Todos');

    return {
      key: uuidv4(),
      indicador: atendimentoTodosUltimos12Meses['quantidade_registrada'],
      titulo: `Total de atendimentos nos últimos 12 meses de ${atendimentoTodosUltimos12Meses['a_partir_do_mes']}/${atendimentoTodosUltimos12Meses['a_partir_do_ano']} a ${atendimentoTodosUltimos12Meses['ate_mes']}/${atendimentoTodosUltimos12Meses['ate_ano']}`,
      indice: atendimentoTodosUltimos12Meses['dif_quantidade_registrada_anterior'],
      indiceDescricao: 'doze meses anteriores'
    };
  };

  const encontrarMesDeUltimoPeriodo = (dados) => {
    const ultimoPeriodo = dados.find(({ periodo, tipo_producao: tipoProducao }) =>
      tipoProducao === 'Todos' && periodo === 'Último período'
    );

    return ultimoPeriodo.nome_mes;
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=''
        botao={ {
          label: '',
          url: ''
        } }
        titulo='<strong>Consultório na Rua</strong>'
      />

      { atendimentos.length !== 0 &&
        <GraficoInfo
          descricao={ `Última competência disponível: ${encontrarMesDeUltimoPeriodo(atendimentos)}` }
        />
      }

      <GraficoInfo
        titulo='Atendimentos realizados por equipes'
        fonte='Fonte: SISAB - Elaboração Impulso Gov'
        descricao='Equipes de Consultório na Rua habilitadas no Ministério da Saúde​'
        tooltip='Total de contatos assistenciais promovidos por todas as equipes de CnR ao longo de um período, considerados atendimentos individuais, odontológicos, procedimentos e visitas domiciliares.'
      />

      <Grid12Col
        items={ [
          <>
            { atendimentos.length !== 0
              ? <CardInfoTipoA { ...getPropsCardUltimoPeriodo() } />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { atendimentos12meses.length !== 0
              ? <CardInfoTipoA { ...getPropsCardUltimos12Meses() } />
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo='Tipo de produção'
        fonte='Fonte: SISAB - Elaboração Impulso Gov'
      />

      { atendimentos.length !== 0
        ? <>
          <FiltroCompetencia
            dados={ atendimentos }
            valor={ filtroCompetencia }
            setValor={ setFiltroCompetencia }
            label='Competência'
            isMulti
          />

          <div className={ styles.GraficoDonutContainer }>
            <ReactEcharts
              option={ getOpcoesGraficoDonut(atendimentosFiltradosOrdenados) }
              style={ { width: '50%', height: '100%' } }
            />

            <TabelaGraficoDonut
              labels={ {
                colunaHeader: 'Tipo de produção',
                colunaQuantidade: 'Quantidade registrada',
              } }
              data={ atendimentosFiltradosOrdenados }
              mensagemDadosZerados='Sem produção registrada nessa competência'
            />
          </div>
        </>
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo='Histórico Temporal'
        fonte='Fonte: SISAB - Elaboração Impulso Gov'
      />

      { atendimentos.length !== 0
        ? <>
          <FiltroTexto
            dados={ atendimentos }
            label='Tipo de produção'
            propriedade='tipo_producao'
            valor={ filtroProducao }
            setValor={ setFiltroProducao }
          />

          <ReactEcharts
            option={ getOpcoesGraficoDeLinha(atendimentos) }
            style={ { width: '100%', height: '70vh' } }
          />
        </>
        : <Spinner theme="ColorSM" />
      }
    </div>
  );
};

export default ConsultorioNaRua;
