import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from '../../../requests/outros-raps';
import styles from '../OutrosRaps.module.css';
import { FiltroTexto, FiltroCompetencia } from '../../../components/Filtros';
import { getOpcoesGraficoDonut } from '../../../helpers/graficoDonut';
import { TabelaGraficoDonut } from '../../../components/Tabelas';

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
  const [filtroCompetencia, setFiltroCompetencia] = useState({
    value: 'Último período', label: 'Último período'
  });

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
    const atendimentosFiltrados = atendimentos.filter(({
      tipo_producao: tipoProducao,
      periodo
    }) =>
      tipoProducao !== 'Todos' && periodo === filtroCompetencia.value
    );

    const atendimentosOrdenados = atendimentosFiltrados
      .sort((a, b) => b.quantidade_registrada - a.quantidade_registrada);

    const atendimentosFormatados = atendimentosOrdenados.map(({
      tipo_producao: nome,
      quantidade_registrada: quantidade
    }) => ({
      nome, quantidade
    }));

    return atendimentosFormatados;
  }, [atendimentos, filtroCompetencia.value]);

  const getPropsCardUltimoPeriodo = () => {
    const atendimentoTodosUltimoPeriodo = atendimentos
      .find((atendimento) => atendimento.tipo_producao === 'Todos' && atendimento.periodo === 'Último período');

    return {
      key: uuidv1(),
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
      key: uuidv1(),
      indicador: atendimentoTodosUltimos12Meses['quantidade_registrada'],
      titulo: `Total de atendimentos nos últimos 12 meses de ${atendimentoTodosUltimos12Meses['a_partir_do_mes']}/${atendimentoTodosUltimos12Meses['a_partir_do_ano']} a ${atendimentoTodosUltimos12Meses['ate_mes']}/${atendimentoTodosUltimos12Meses['ate_ano']}`,
      indice: atendimentoTodosUltimos12Meses['dif_quantidade_registrada_anterior'],
      indiceDescricao: 'doze meses anteriores'
    };
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=''
        botao={{
          label: '',
          url: ''
        }}
        titulo='<strong>Consultório na Rua</strong>'
      />

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
          />

          <div className={ styles.GraficoDonutContainer }>
            <ReactEcharts
              option={ getOpcoesGraficoDonut(atendimentosFiltradosOrdenados) }
              style={ { width: '50%', height: '100%' } }
            />

            <TabelaGraficoDonut
              labels={{
                colunaHeader: 'Tipo de produção',
                colunaQuantidade: 'Quantidade registrada',
              }}
              data={ atendimentosFiltradosOrdenados }
              mensagemDadosZerados=''
            />
          </div>
        </>
        : <Spinner theme="ColorSM" height="70vh" />
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
        : <Spinner theme="ColorSM" height="70vh" />
      }
    </div>
  );
};

export default ConsultorioNaRua;
