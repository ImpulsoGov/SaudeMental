import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { agregarPorCondicaoSaude, getOpcoesGraficoCID } from "../../../helpers/graficoCID";
import { agregarPorFaixaEtariaEGenero, getOpcoesGraficoGeneroEFaixaEtaria } from "../../../helpers/graficoGeneroEFaixaEtaria";
import { getOpcoesGraficoHistoricoTemporal } from "../../../helpers/graficoHistoricoTemporal";
import { agregarPorRacaCor, getOpcoesGraficoRacaEcor } from "../../../helpers/graficoRacaECor";
import { getAtendimentosPorCID, getAtendimentosPorCaps, getAtendimentosPorGeneroEIdade, getAtendimentosPorRacaECor, getEstabelecimentos, getPerfilDeAtendimentos, getPeriodos } from "../../../requests/caps";
import { concatenarPeriodos } from "../../../utils/concatenarPeriodos";
import styles from "../Caps.module.css";

const FILTRO_PERIODO_MULTI_DEFAULT = [
  { value: "Último período", label: "Último período" },
];
const FILTRO_ESTABELECIMENTO_DEFAULT = {
  value: "Todos", label: "Todos"
};

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const AtendimentoIndividual = () => {
  const { data: session } = useSession();
  const [perfilAtendimentos, setPerfilAtendimentos] = useState([]);
  // const [resumoPerfilAtendimentos, setResumoPerfilAtendimentos] = useState();
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
      setPerfilAtendimentos(await getPerfilDeAtendimentos(municipioIdSus));
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

  const getCardsAtendimentosPorCaps = (atendimentos) => {
    const atendimentosPorCapsUltimoPeriodo = atendimentos
      .filter(({
        periodo,
        estabelecimento,
        estabelecimento_linha_perfil: linhaPerfil,
        estabelecimento_linha_idade: linhaIdade
      }) =>
        periodo === "Último período"
        && estabelecimento !== "Todos"
        && linhaPerfil !== "Todos"
        && linhaIdade === "Todos"
      );

    const atendimentosAgregados = agregarPorLinhaPerfil(atendimentosPorCapsUltimoPeriodo);

    const cardsAtendimentosPorCaps = atendimentosAgregados.map(({
      linhaPerfil, atendimentosPorEstabelecimento, nomeMes
    }) => (
      <>
        <GraficoInfo
          titulo={ `CAPS ${linhaPerfil}` }
          descricao={ `Dados de ${nomeMes}` }
        />

        <Grid12Col
          items={
            atendimentosPorEstabelecimento.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.porcentagemAtendimentos }
                indicadorSimbolo="%"
                indice={ item.difPorcentagemAtendimentosAnterior }
                indiceSimbolo="p.p."
                indiceDescricao="últ. mês"
                key={ uuidv1() }
              />
            ))
          }
          proporcao="3-3-3-3"
        />
      </>
    ));

    return cardsAtendimentosPorCaps;
  };

  const filtrarPorEstabelecimento = (dados, filtroEstabelecimento) => {
    return dados
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento.value
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
      );
  };

  const filtrarPorPeriodoEstabelecimento = (dados, filtroEstabelecimento, filtroPeriodo) => {
    const periodosSelecionados = filtroPeriodo.map(({ value }) => value);

    return dados.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && periodosSelecionados.includes(item.periodo)
      && item.estabelecimento_linha_perfil === "Todos"
      && item.estabelecimento_linha_idade === "Todos"
    );
  };

  const agregadosPorCID = useMemo(() => {
    return agregarPorCondicaoSaude(
      atendimentosPorCID,
      "usuario_condicao_saude",
      "usuarios_apenas_atendimento_individual"
    );
  }, [atendimentosPorCID]);

  const agregadosPorGeneroEFaixaEtaria = useMemo(() => {
    return agregarPorFaixaEtariaEGenero(
      atendimentosPorGenero,
      "usuario_faixa_etaria",
      "usuario_sexo",
      "usuarios_apenas_atendimento_individual"
    );
  }, [atendimentosPorGenero]);

  const agregadosPorRacaCor = useMemo(() => {
    return agregarPorRacaCor(
      atendimentosPorRacaECor,
      "usuario_raca_cor",
      "usuarios_apenas_atendimento_individual"
    );
  }, [atendimentosPorRacaECor]);

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Atendimentos individuais </strong>"
      />

      <GraficoInfo
        descricao="Taxa dos usuários frequentantes no mês que realizaram apenas atendimentos individuais"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { atendimentosPorCaps.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${atendimentosPorCaps
                .find((item) =>
                  item.estabelecimento === "Todos"
                  && item.estabelecimento_linha_perfil === "Todos"
                  && item.estabelecimento_linha_idade === "Todos"
                  && item.periodo === "Último período"
                )
                .nome_mes
                }` }
            />

            { getCardsAtendimentosPorCaps(atendimentosPorCaps) }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { atendimentosPorCaps.length !== 0
        ? (
          <>
            <div className={ styles.Filtro }>
              <Select { ...getPropsFiltroEstabelecimento(
                atendimentosPorCaps,
                filtroEstabelecimentoHistorico,
                setFiltroEstabelecimentoHistorico
              ) } />
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoHistoricoTemporal(
                filtrarPorEstabelecimento(atendimentosPorCaps, filtroEstabelecimentoHistorico),
                "perc_apenas_atendimentos_individuais",
                "Usuários que realizaram apenas atendimentos individuais entre os que frequentaram no mês (%):"
              ) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="CID dos usuários que realizaram apenas atendimentos individuais"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { atendimentosPorCID
        && estabelecimentos.length !== 0
        && periodos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select { ...getPropsFiltroEstabelecimento(
                  estabelecimentos,
                  filtroEstabelecimentoCID,
                  setFiltroEstabelecimentoCID
                ) } />
              </div>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroPeriodo(
                    periodos,
                    filtroPeriodoCID,
                    setFiltroPeriodoCID
                  )
                } />
              </div>
            </div>

            { loadingCID
              ? <Spinner theme="ColorSM" height="70vh" />
              : <ReactEcharts
                option={ getOpcoesGraficoCID(agregadosPorCID) }
                style={ { width: "100%", height: "70vh" } }
              />
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { atendimentosPorGenero
        && estabelecimentos.length !== 0
        && periodos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select { ...getPropsFiltroEstabelecimento(
                  estabelecimentos,
                  filtroEstabelecimentoGenero,
                  setFiltroEstabelecimentoGenero
                ) } />
              </div>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroPeriodo(
                    periodos,
                    filtroPeriodoGenero,
                    setFiltroPeriodoGenero
                  )
                } />
              </div>
            </div>

            { loadingGenero
              ? <Spinner theme="ColorSM" height="70vh" />
              : <ReactEcharts
                option={ getOpcoesGraficoGeneroEFaixaEtaria(
                  agregadosPorGeneroEFaixaEtaria,
                  ""
                ) }
                style={ { width: "100%", height: "70vh" } }
              />
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { atendimentosPorRacaECor
        && estabelecimentos.length !== 0
        && periodos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select { ...getPropsFiltroEstabelecimento(
                  estabelecimentos,
                  filtroEstabelecimentoRacaECor,
                  setFiltroEstabelecimentoRacaECor
                ) } />
              </div>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroPeriodo(
                    periodos,
                    filtroPeriodoRacaECor,
                    setFiltroPeriodoRacaECor
                  )
                } />
              </div>
            </div>

            { loadingRaca
              ? <Spinner theme="ColorSM" height="70vh" />
              : <ReactEcharts
                option={ getOpcoesGraficoRacaEcor(
                  agregadosPorRacaCor,
                  "Usuários que realizaram apenas atendimentos individuais"
                ) }
                style={ { width: "100%", height: "70vh" } }
              />
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        descricao="*Dados podem ter problemas de coleta, registro e preenchimento"
      />
    </div>
  );
};

export default AtendimentoIndividual;
