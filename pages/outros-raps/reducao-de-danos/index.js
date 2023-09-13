import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FiltroTexto from '../../../components/Filtros/FiltroTexto';
import { FILTRO_ESTABELECIMENTO_MULTI_DEFAULT, FILTRO_OCUPACAO_DEFAULT } from '../../../constants/FILTROS';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAcoesReducaoDeDanos, getAcoesReducaoDeDanos12meses } from '../../../requests/outros-raps';
import styles from '../OutrosRaps.module.css';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ReducaoDeDanos = () => {
  const { data: session } = useSession();
  const [acoes, setAcoes] = useState([]);
  const [acoes12meses, setAcoes12meses] = useState([]);
  const [filtroEstabelecimento, setFiltroEstabelecimento] = useState(FILTRO_ESTABELECIMENTO_MULTI_DEFAULT);
  const [filtroOcupacao, setFiltroOcupacao] = useState(FILTRO_OCUPACAO_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAcoes(await getAcoesReducaoDeDanos(municipioIdSus));
      setAcoes12meses(await getAcoesReducaoDeDanos12meses(municipioIdSus));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const getPropsCardUltimoPeriodo = (acoes) => {
    const acaoTodosUltimoPeriodo = acoes
      .find((acao) => acao.estabelecimento === 'Todos' && acao.profissional_vinculo_ocupacao === 'Todas' && acao.periodo === 'Último período');

    return {
      key: uuidv4(),
      indicador: acaoTodosUltimoPeriodo['quantidade_registrada'],
      titulo: `Total de ações de redução de danos em ${acaoTodosUltimoPeriodo['nome_mes']}`,
      indice: acaoTodosUltimoPeriodo['dif_quantidade_registrada_anterior'],
      indiceDescricao: 'últ. mês'
    };
  };

  const getPropsCardUltimos12Meses = (acoes) => {
    const acaoTodosUltimos12Meses = acoes
      .find((acao) => acao.estabelecimento === 'Todos' && acao.profissional_vinculo_ocupacao === 'Todas');

    return {
      key: uuidv4(),
      indicador: acaoTodosUltimos12Meses['quantidade_registrada'],
      titulo: `Total de ações de redução de danos nos últimos 12 meses de ${acaoTodosUltimos12Meses['a_partir_do_mes']}/${acaoTodosUltimos12Meses['a_partir_do_ano']} a ${acaoTodosUltimos12Meses['ate_mes']}/${acaoTodosUltimos12Meses['ate_ano']}`,
      indice: acaoTodosUltimos12Meses['dif_quantidade_registrada_anterior'],
      indiceDescricao: 'doze meses anteriores'
    };
  };

  const ordenarQuantidadesPorCompetenciaAsc = (acoes) => {
    return acoes.sort((a, b) => new Date(a.competencia) - new Date(b.competencia));
  };

  const agregarQuantidadePorPeriodo = (dados) => {
    const dadosAgregados = [];

    dados.forEach(({ periodo, competencia, quantidade_registrada: quantidade }) => {
      const periodoEncontrado = dadosAgregados.find((item) => periodo === item.periodo);

      if (periodoEncontrado) {
        periodoEncontrado.quantidade += quantidade;
      } else {
        dadosAgregados.push({ periodo, competencia, quantidade });
      }
    });

    return dadosAgregados;
  };

  const getOpcoesGraficoDeLinha = (acoes) => {
    const estabelecimentosSelecionados = filtroEstabelecimento.map(({ value }) => value);
    const acoesFiltradas = acoes.filter(({
      estabelecimento,
      profissional_vinculo_ocupacao: ocupacao
    }) =>
      estabelecimentosSelecionados.includes(estabelecimento)
      && ocupacao === filtroOcupacao.value
    );
    const acoesAgregadas = agregarQuantidadePorPeriodo(acoesFiltradas);
    const acoesOrdenadas = ordenarQuantidadesPorCompetenciaAsc(acoesAgregadas);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            backgroundColor: '#6a7985'
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
        data: acoesOrdenadas.map(({ periodo }) => periodo)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Ações registradas',
          data: acoesOrdenadas.map(({ quantidade }) => quantidade),
          type: 'line',
          itemStyle: {
            color: '#5367C9'
          },
        }
      ]
    };
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        botao={ {
          label: '',
          url: ''
        } }
        titulo="<strong>Ações de Redução de Danos</strong>"
      />

      <GraficoInfo
        titulo="Ações de redução de danos realizadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        tooltip="Total de procedimentos registrados como 'ação de redução de danos', segundo informado pelos profissionais de saúde por meios dos Boletins de Produção Ambulatorial consolidados (BPA-c)."
      />

      <Grid12Col
        items={ [
          <>
            { acoes.length !== 0
              ? <CardInfoTipoA { ...getPropsCardUltimoPeriodo(acoes) } />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { acoes12meses.length !== 0
              ? <CardInfoTipoA { ...getPropsCardUltimos12Meses(acoes12meses) } />
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      { acoes.length !== 0
        ? <>
          <div className={ styles.Filtros }>
            <FiltroTexto
              dados={ acoes }
              label='Estabelecimento'
              propriedade='estabelecimento'
              valor={ filtroEstabelecimento }
              setValor={ setFiltroEstabelecimento }
              isMulti
            />
            <FiltroTexto
              dados={ acoes }
              label='CBO do profissional'
              propriedade='profissional_vinculo_ocupacao'
              valor={ filtroOcupacao }
              setValor={ setFiltroOcupacao }
            />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoDeLinha(acoes) }
            style={ { width: '100%', height: '70vh' } }
          />
        </>
        : <Spinner theme="ColorSM" height="70vh" />
      }
    </div>
  );
};

export default ReducaoDeDanos;
