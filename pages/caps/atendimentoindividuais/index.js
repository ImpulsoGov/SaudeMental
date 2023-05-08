import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { agregarPorCondicaoSaude, getOpcoesGraficoCID } from "../../../helpers/graficoCID";
import { agregarPorFaixaEtariaEGenero, getOpcoesGraficoGeneroEFaixaEtaria } from "../../../helpers/graficoGeneroEFaixaEtaria";
import { getOpcoesGraficoHistoricoTemporal } from "../../../helpers/graficoHistoricoTemporal";
import { agregarPorRacaCor, getOpcoesGraficoRacaEcor } from "../../../helpers/graficoRacaECor";
import { getAtendimentosPorCaps, getPerfilDeAtendimentos } from "../../../requests/caps";
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
  const [resumoPerfilAtendimentos, setResumoPerfilAtendimentos] = useState();
  const [atendimentosPorCaps, setAtendimentosPorCaps] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoCID, setFiltroPeriodoCID] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoRacaECor, setFiltroPeriodoRacaECor] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoRacaECor, setFiltroEstabelecimentoRacaECor] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setPerfilAtendimentos(await getPerfilDeAtendimentos(municipioIdSus));
      setAtendimentosPorCaps(await getAtendimentosPorCaps(municipioIdSus));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

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

  const agregadosPorCondicaoSaude = agregarPorCondicaoSaude(
    filtrarPorPeriodoEstabelecimento(perfilAtendimentos, filtroEstabelecimentoCID, filtroPeriodoCID),
    "usuario_condicao_saude",
    "usuarios_apenas_atendimento_individual"
  );

  const agregadosPorGeneroEFaixaEtaria = agregarPorFaixaEtariaEGenero(
    filtrarPorPeriodoEstabelecimento(perfilAtendimentos, filtroEstabelecimentoGenero, filtroPeriodoGenero),
    "usuario_faixa_etaria_descricao",
    "usuario_sexo",
    "usuarios_apenas_atendimento_individual"
  );

  const agregadosPorRacaCor = agregarPorRacaCor(
    filtrarPorPeriodoEstabelecimento(perfilAtendimentos, filtroEstabelecimentoRacaECor, filtroPeriodoRacaECor),
    "usuario_raca_cor",
    "usuarios_apenas_atendimento_individual"
  );

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
        : <Spinner theme="SM" />
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
        : <Spinner theme="SM" />
      }

      <GraficoInfo
        titulo="CID dos usuários que realizaram apenas atendimentos individuais"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfilAtendimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select { ...getPropsFiltroEstabelecimento(
                  perfilAtendimentos,
                  filtroEstabelecimentoCID,
                  setFiltroEstabelecimentoCID
                ) } />
              </div>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroPeriodo(
                    perfilAtendimentos,
                    filtroPeriodoCID,
                    setFiltroPeriodoCID
                  )
                } />
              </div>
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoCID(agregadosPorCondicaoSaude) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="SM" />
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfilAtendimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select { ...getPropsFiltroEstabelecimento(
                  perfilAtendimentos,
                  filtroEstabelecimentoGenero,
                  setFiltroEstabelecimentoGenero
                ) } />
              </div>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroPeriodo(
                    perfilAtendimentos,
                    filtroPeriodoGenero,
                    setFiltroPeriodoGenero
                  )
                } />
              </div>
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoGeneroEFaixaEtaria(
                agregadosPorGeneroEFaixaEtaria,
                ""
              ) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="SM" />
      }

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfilAtendimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select { ...getPropsFiltroEstabelecimento(
                  perfilAtendimentos,
                  filtroEstabelecimentoRacaECor,
                  setFiltroEstabelecimentoRacaECor
                ) } />
              </div>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroPeriodo(
                    perfilAtendimentos,
                    filtroPeriodoRacaECor,
                    setFiltroPeriodoRacaECor
                  )
                } />
              </div>
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoRacaEcor(
                agregadosPorRacaCor,
                "Usuários que realizaram apenas atendimentos individuais"
              ) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="SM" />
      }

      <GraficoInfo
        descricao="*Dados podem ter problemas de coleta, registro e preenchimento"
      />
    </div>
  );
};

export default AtendimentoIndividual;
