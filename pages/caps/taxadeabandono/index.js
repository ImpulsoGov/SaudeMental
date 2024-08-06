import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAbandonoCoortes, getAbandonoMensal, getEstabelecimentos, getEvasoesNoMesPorCID, getEvasoesNoMesPorGeneroEIdade, getPeriodos } from '../../../requests/caps';
import { TabelaGraficoDonut } from '../../../components/Tabelas';
import { GraficoDonut, GraficoGeneroPorFaixaEtaria } from '../../../components/Graficos';
import GraficoHistoricoTemporal from '../../../components/Graficos/HistoricoTemporal';
import { concatenarPeriodos } from '../../../utils/concatenarPeriodos';
import { ordenarDecrescentePorPropriedadeNumerica } from '../../../utils/ordenacao';
import styles from '../Caps.module.css';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import {FILTRO_PERIODO_MULTI_DEFAULT, FILTRO_ESTABELECIMENTO_DEFAULT} from '../../../constants/FILTROS';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const TaxaAbandono = () => {
  const { data: session } = useSession();
  const [abandonoCoortes, setAbandonoCoortes] = useState([]);
  const [evasoesNoMesPorCID, setEvasoesNoMesPorCID] = useState([]);
  const [evasoesNoMesPorGeneroEIdade, setEvasoesNoMesPorGeneroEIdade] = useState([]);
  const [abandonoMensal, setAbandonoMensal] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: 'Todos', label: 'Todos'
  });
  const [filtroPeriodoCID, setFiltroPeriodoCID] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [loadingCID, setLoadingCID] = useState(false);
  const [loadingGenero, setLoadingGenero] = useState(false);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAbandonoMensal(await getAbandonoMensal(municipioIdSus));
      setEstabelecimentos(
        await getEstabelecimentos(municipioIdSus, 'abandono_perfil')
      );
      setPeriodos(
        await getPeriodos(municipioIdSus, 'abandono_perfil')
      );
      setAbandonoCoortes(await getAbandonoCoortes({
        municipioIdSus,
        periodos: 'Último período'
      }));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, [session?.user.municipio_id_ibge]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCID(true);

      const valoresPeriodos = filtroPeriodoCID.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getEvasoesNoMesPorCID(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoCID.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setEvasoesNoMesPorCID(dadosFiltrados);
        setLoadingCID(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoCID.value, filtroPeriodoCID]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingGenero(true);

      const valoresPeriodos = filtroPeriodoGenero.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getEvasoesNoMesPorGeneroEIdade(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoGenero.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setEvasoesNoMesPorGeneroEIdade(dadosFiltrados);
        setLoadingGenero(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoGenero.value, filtroPeriodoGenero]);

  const getCardsAbandonoAcumulado = (abandonos) => {
    const abandonosExcetoTodos = abandonos
      .filter(({estabelecimento}) => estabelecimento !== 'Todos');
    const abandonosOrdenadosPorValor = ordenarDecrescentePorPropriedadeNumerica(
      abandonosExcetoTodos,
      'usuarios_coorte_nao_aderiram_perc'
    );

    return (
      <>
        <GraficoInfo
          titulo='Taxa de não adesão acumulada'
          tooltip='Dos usuários que entraram no início do período indicado, porcentagem que deixou de frequentar nos três meses seguintes (não aderiu ao serviço)'
          descricao={ `Conjunto de usuários com 1° procedimento em ${abandonoCoortes[0].a_partir_do_mes}/${abandonoCoortes[0].a_partir_do_ano} e não adesão até ${abandonoCoortes[0].ate_mes}/${abandonoCoortes[0].ate_ano}` }
          fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
        />

        <Grid12Col
          items={
            abandonosOrdenadosPorValor.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.usuarios_coorte_nao_aderiram_perc }
                indicadorSimbolo='%'
                key={ item.id }
              />
            ))
          }
          proporcao='4-4-4'
        />
      </>
    );
  };

  const filtrarPorEstabelecimento = (dados, filtroEstabelecimento) => {
    return dados
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento.value
      );
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        botao={{
          label: '',
          url: ''
        }}
        titulo="<strong>Taxa de não adesão</strong>"
      />

      { abandonoCoortes.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${abandonoCoortes
                .find((item) =>
                  item.estabelecimento === 'Todos'
                )
                .nome_mes
              }` }
            />

            { getCardsAbandonoAcumulado(abandonoCoortes) }
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Histórico Temporal - Taxa mensal'
        descricao='Dos usuários acolhidos há menos de 3 meses, quantos não aderiram ao serviço no mês'
        tooltip='Diferente do indicador de não adesão acumulado, que mostra o percentual de usuários que iniciaram o vínculo em um determinado mês e em até 3 meses deixaram de frequentar o CAPS, a taxa de não adesão mensal mostra o percentual de usuários recentes que deixaram de frequentar o serviço em um mês específico. Ou seja, o indicador mensal mostra qual foi o mês que o usuário iniciou o período de inatividade (que precisa ser igual ou superior a 3 meses).'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
        destaque='Por que esses valores são diferentes?'
      />

      { abandonoMensal.length !== 0
        ? (
          <>
            <FiltroTexto
              width={'50%'}
              dados = {abandonoMensal}
              valor = {filtroEstabelecimentoHistorico}
              setValor = {setFiltroEstabelecimentoHistorico}
              label = {'Estabelecimento'}
              propriedade = {'estabelecimento'}
            />
            <GraficoHistoricoTemporal
              dados = {filtrarPorEstabelecimento(abandonoMensal, filtroEstabelecimentoHistorico)}
              textoTooltip={'Taxa de não adesão mensal (%):'}
              loading = {false}
              propriedade={'usuarios_evasao_perc'}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='CID dos usuários que não aderiram ao serviço'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { evasoesNoMesPorCID
        && periodos.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoCID}
                setValor = {setFiltroEstabelecimentoCID}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {periodos}
                valor = {filtroPeriodoCID}
                setValor = {setFiltroPeriodoCID}
                isMulti
                label = {'Competência'}
              />
            </div>

            <div className={ styles.GraficoCIDContainer }>
              <GraficoDonut
                dados={ evasoesNoMesPorCID }
                propriedades={ {
                  nome: 'usuario_condicao_saude',
                  quantidade: 'quantidade_registrada'
                } }
                loading={ loadingCID }
              />

              <TabelaGraficoDonut
                labels={ {
                  colunaHeader: 'Grupo de diagnósticos',
                  colunaQuantidade: 'Evadiram no mês',
                } }
                propriedades={ {
                  nome: 'usuario_condicao_saude',
                  quantidade: 'quantidade_registrada'
                } }
                data={ evasoesNoMesPorCID }
                mensagemDadosZerados='Sem usuários nessa competência'
              />
            </div>
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Gênero e faixa etária'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { evasoesNoMesPorGeneroEIdade
        && periodos.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoGenero}
                setValor = {setFiltroEstabelecimentoGenero}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {periodos}
                valor = {filtroPeriodoGenero}
                setValor = {setFiltroPeriodoGenero}
                isMulti
                label = {'Competência'}
              />
            </div>
            <GraficoGeneroPorFaixaEtaria
              dados = {evasoesNoMesPorGeneroEIdade}
              labels={{
                eixoY: 'Nº de usuários que não aderiram no mês'
              }}
              loading = {loadingGenero}
              propriedades={{
                faixaEtaria: 'usuario_faixa_etaria',
                sexo: 'usuario_sexo',
                quantidade: 'quantidade_registrada',
              }}

            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }
    </div>
  );
};

export default TaxaAbandono;
