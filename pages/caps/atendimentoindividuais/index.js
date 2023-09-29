import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { TabelaGraficoDonut } from '../../../components/Tabelas';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import GraficoGeneroPorFaixaEtaria from '../../../components/Graficos/GeneroPorFaixaEtaria';
import GraficoRacaECor from '../../../components/Graficos/RacaECor';
import GraficoHistoricoTemporal from '../../../components/Graficos/HistoricoTemporal';
import { getAtendimentosPorCID, getAtendimentosPorCaps, getAtendimentosPorGeneroEIdade, getAtendimentosPorRacaECor, getEstabelecimentos, getPeriodos } from '../../../requests/caps';
import { concatenarPeriodos } from '../../../utils/concatenarPeriodos';
import styles from '../Caps.module.css';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import {FILTRO_PERIODO_MULTI_DEFAULT, FILTRO_ESTABELECIMENTO_DEFAULT} from '../../../constants/FILTROS';
import { GraficoDonut } from '../../../components/Graficos';
import { ordenarCrescentePorPropriedadeDeTexto } from '../../../utils/ordenacao';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const AtendimentoIndividual = () => {
  const { data: session } = useSession();
  const [atendimentosPorCID, setAtendimentosPorCID] = useState([]);
  const [atendimentosPorGenero, setAtendimentosPorGenero] = useState([]);
  const [atendimentosPorRacaECor, setAtendimentosPorRacaECor] = useState([]);
  const [atendimentosPorCaps, setAtendimentosPorCaps] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoCID, setFiltroPeriodoCID] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoRacaECor, setFiltroPeriodoRacaECor] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoRacaECor, setFiltroEstabelecimentoRacaECor] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [loadingCID, setLoadingCID] = useState(false);
  const [loadingGenero, setLoadingGenero] = useState(false);
  const [loadingRaca, setLoadingRaca] = useState(false);
  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendimentosPorCaps(await getAtendimentosPorCaps(municipioIdSus));
      setEstabelecimentos(await getEstabelecimentos(municipioIdSus, 'atendimentos_inidividuais_perfil'));
      setPeriodos(await getPeriodos(municipioIdSus, 'atendimentos_inidividuais_perfil'));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCID(true);

      const valoresPeriodos = filtroPeriodoCID.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getAtendimentosPorCID(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoCID.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setAtendimentosPorCID(dadosFiltrados);
        setLoadingCID(false);
      });
    }
  }, [filtroEstabelecimentoCID.value, filtroPeriodoCID, session?.user.municipio_id_ibge]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingGenero(true);

      const valoresPeriodos = filtroPeriodoGenero.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getAtendimentosPorGeneroEIdade(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoGenero.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setAtendimentosPorGenero(dadosFiltrados);
        setLoadingGenero(false);
      });
    }
  }, [filtroEstabelecimentoGenero.value, filtroPeriodoGenero, session?.user.municipio_id_ibge]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingRaca(true);

      const valoresPeriodos = filtroPeriodoRacaECor.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getAtendimentosPorRacaECor(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoRacaECor.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setAtendimentosPorRacaECor(dadosFiltrados);
        setLoadingRaca(false);
      });
    }
  }, [filtroEstabelecimentoRacaECor.value, filtroPeriodoRacaECor, session?.user.municipio_id_ibge]);

  const agregarPorLinhaPerfil = (atendimentos) => {
    const atendimentosAgregados = [];

    atendimentos.forEach((atendimento) => {
      const {
        estabelecimento,
        nome_mes: nomeMes,
        estabelecimento_linha_perfil: linhaPerfil,
        perc_apenas_atendimentos_individuais: porcentagemAtendimentos,
        dif_perc_apenas_atendimentos_individuais: difPorcentagemAtendimentosAnterior
      } = atendimento;

      const linhaPerfilEncontrada = atendimentosAgregados
        .find((item) => item.linhaPerfil === linhaPerfil);

      if (!linhaPerfilEncontrada) {
        atendimentosAgregados.push({
          nomeMes,
          linhaPerfil,
          atendimentosPorEstabelecimento: [{
            estabelecimento,
            porcentagemAtendimentos,
            difPorcentagemAtendimentosAnterior
          }]
        });
      } else {
        linhaPerfilEncontrada.atendimentosPorEstabelecimento.push({
          estabelecimento,
          porcentagemAtendimentos,
          difPorcentagemAtendimentosAnterior
        });
      }
    });

    return atendimentosAgregados;
  };
  const getDadosFiltradosGeneroEFaixaEtaria = useMemo(() => {
    const periodosSelecionados = filtroPeriodoGenero.map(({ value }) => value);

    return atendimentosPorGenero.filter((item) =>
      item.estabelecimento === filtroEstabelecimentoGenero.value
      && periodosSelecionados.includes(item.periodo)
    );
  }, [atendimentosPorGenero, filtroPeriodoGenero, filtroEstabelecimentoGenero.value]);

  const getDadosFiltradosRacaECor = useMemo(() => {
    const periodosSelecionados = filtroPeriodoRacaECor.map(({ value }) => value);

    return atendimentosPorRacaECor.filter((item) =>
      item.estabelecimento === filtroEstabelecimentoRacaECor.value
      && periodosSelecionados.includes(item.periodo)
    );
  }, [atendimentosPorRacaECor, filtroPeriodoRacaECor, filtroEstabelecimentoRacaECor.value]);

  const getCardsAtendimentosPorCaps = (atendimentos) => {
    const atendimentosPorCapsUltimoPeriodo = atendimentos
      .filter(({
        periodo,
        estabelecimento,
        estabelecimento_linha_perfil: linhaPerfil,
        estabelecimento_linha_idade: linhaIdade
      }) =>
        periodo === 'Último período'
        && estabelecimento !== 'Todos'
        && linhaPerfil !== 'Todos'
        && linhaIdade === 'Todos'
      );

    const atendimentosAgregados = agregarPorLinhaPerfil(atendimentosPorCapsUltimoPeriodo);

    const cardsAtendimentosPorCaps = atendimentosAgregados.map(({
      linhaPerfil, atendimentosPorEstabelecimento, nomeMes
    }) => {
      const atendimentosOrdenados = ordenarCrescentePorPropriedadeDeTexto(atendimentosPorEstabelecimento, 'estabelecimento');

      return (
        <>
          <GraficoInfo
            titulo={ `CAPS ${linhaPerfil}` }
            descricao={ `Dados de ${nomeMes}` }
          />

          <Grid12Col
            items={
              atendimentosOrdenados.map((item) => (
                <CardInfoTipoA
                  titulo={ item.estabelecimento }
                  indicador={ item.porcentagemAtendimentos }
                  indicadorSimbolo='%'
                  indice={ item.difPorcentagemAtendimentosAnterior }
                  indiceSimbolo='p.p.'
                  indiceDescricao='últ. mês'
                  key={ uuidv1() }
                />
              ))
            }
            proporcao='3-3-3-3'
          />
        </>
      );
    });

    return cardsAtendimentosPorCaps;
  };

  const filtrarPorEstabelecimento = (dados, filtroEstabelecimento) => {
    return dados
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento.value
        && item.estabelecimento_linha_perfil === 'Todos'
        && item.estabelecimento_linha_idade === 'Todos'
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
        titulo="<strong>Atendimentos individuais </strong>"
      />

      <GraficoInfo
        descricao='Taxa dos usuários frequentantes no mês que realizaram apenas atendimentos individuais'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { atendimentosPorCaps.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${atendimentosPorCaps
                .find((item) =>
                  item.estabelecimento === 'Todos'
                  && item.estabelecimento_linha_perfil === 'Todos'
                  && item.estabelecimento_linha_idade === 'Todos'
                  && item.periodo === 'Último período'
                )
                .nome_mes
              }` }
            />

            { getCardsAtendimentosPorCaps(atendimentosPorCaps) }
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Histórico Temporal'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { atendimentosPorCaps.length !== 0
        ? (
          <>
            <FiltroTexto
              width={'50%'}
              dados = {atendimentosPorCaps}
              valor = {filtroEstabelecimentoHistorico}
              setValor = {setFiltroEstabelecimentoHistorico}
              label = {'Estabelecimento'}
              propriedade = {'estabelecimento'}
            />
            <GraficoHistoricoTemporal
              dados = {filtrarPorEstabelecimento(atendimentosPorCaps, filtroEstabelecimentoHistorico)}
              label={'Usuários que realizaram apenas atendimentos individuais entre os que frequentaram no mês (%):'}
              loading = {false}
              propriedade={'perc_apenas_atendimentos_individuais'}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='CID dos usuários que realizaram apenas atendimentos individuais'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { atendimentosPorCID
        && estabelecimentos.length !== 0
        && periodos.length !== 0
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
                isMulti = {true}
                label = {'Competência'}
              />
            </div>

            <div className={ styles.GraficoCIDContainer }>
              <GraficoDonut
                dados={ atendimentosPorCID }
                propriedades={ {
                  nome: 'usuario_condicao_saude',
                  quantidade: 'usuarios_apenas_atendimento_individual'
                } }
                loading={ loadingCID }
              />

              <TabelaGraficoDonut
                labels={ {
                  colunaHeader: 'Grupos de diagnósticos',
                  colunaQuantidade: 'Realizaram só at. individual no mês',
                } }
                propriedades={ {
                  nome: 'usuario_condicao_saude',
                  quantidade: 'usuarios_apenas_atendimento_individual'
                } }
                data={ atendimentosPorCID }
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

      { atendimentosPorGenero
        && estabelecimentos.length !== 0
        && periodos.length !== 0
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
                isMulti = {true}
                label = {'Competência'}
              />
            </div>
            <GraficoGeneroPorFaixaEtaria
              dados = {getDadosFiltradosGeneroEFaixaEtaria}
              labels={{
                eixoY: 'Nº de usuários que passaram apenas por atendimentos individuais'
              }}
              loading = {loadingGenero}
              propriedades={{
                faixaEtaria: 'usuario_faixa_etaria',
                sexo: 'usuario_sexo',
                quantidade: 'usuarios_apenas_atendimento_individual',
              }}

            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Raça/Cor*'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { atendimentosPorRacaECor
        && estabelecimentos.length !== 0
        && periodos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoRacaECor}
                setValor = {setFiltroEstabelecimentoRacaECor}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {periodos}
                valor = {filtroPeriodoRacaECor}
                setValor = {setFiltroPeriodoRacaECor}
                isMulti = {true}
                label = {'Competência'}
              />
            </div>
            <GraficoRacaECor
              dados = {getDadosFiltradosRacaECor}
              label={'Usuários que realizaram apenas atendimentos individuais'}
              loading = {loadingRaca}
              propriedades={{
                racaCor: 'usuario_raca_cor',
                quantidade: 'usuarios_apenas_atendimento_individual',
              }}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        descricao='*Dados podem ter problemas de coleta, registro e preenchimento'
      />
    </div>
  );
};

export default AtendimentoIndividual;
