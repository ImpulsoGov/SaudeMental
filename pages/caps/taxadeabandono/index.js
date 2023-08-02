import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAbandonoCoortes, getAbandonoMensal, getEstabelecimentos, getEvasoesNoMesPorCID, getEvasoesNoMesPorGeneroEIdade, getPeriodos } from "../../../requests/caps";

import ReactEcharts from "echarts-for-react";
import Select from "react-select";
import { TabelaCid } from "../../../components/Tabelas";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { agregarPorCondicaoSaude, getOpcoesGraficoCID } from "../../../helpers/graficoCID";
import { agregarPorFaixaEtariaEGenero, getOpcoesGraficoGeneroEFaixaEtaria } from "../../../helpers/graficoGeneroEFaixaEtaria";
import { getOpcoesGraficoHistoricoTemporal } from "../../../helpers/graficoHistoricoTemporal";
import { concatenarPeriodos } from "../../../utils/concatenarPeriodos";
import { agregarPorRacaCor } from "../../../helpers/graficoRacaECor";
import { ordenarDecrescentePorPropriedadeNumerica } from "../../../utils/ordenacao";
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

const TaxaAbandono = () => {
  const { data: session } = useSession();
  const [abandonoCoortes, setAbandonoCoortes] = useState([]);
  const [evasoesNoMesPorCID, setEvasoesNoMesPorCID] = useState([]);
  const [evasoesNoMesPorGeneroEIdade, setEvasoesNoMesPorGeneroEIdade] = useState([]);
  const [abandonoMensal, setAbandonoMensal] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroPeriodoCID, setFiltroPeriodoCID] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  // const [filtroPeriodoRacaECor, setFiltroPeriodoRacaECor] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  // const [filtroEstabelecimentoRacaECor, setFiltroEstabelecimentoRacaECor] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [loadingCID, setLoadingCID] = useState(false);
  const [loadingGenero, setLoadingGenero] = useState(false);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAbandonoCoortes(await getAbandonoCoortes(municipioIdSus));
      setAbandonoMensal(await getAbandonoMensal(municipioIdSus));
      setEstabelecimentos(
        await getEstabelecimentos(municipioIdSus, 'abandono_perfil')
      );
      setPeriodos(
        await getPeriodos(municipioIdSus, 'abandono_perfil')
      );
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
    const abandonosUltimoPeriodo = abandonos
      .filter(({ periodo, estabelecimento }) => periodo === "Último período" && estabelecimento !== "Todos");
    const abandonosOrdenadosPorValor = ordenarDecrescentePorPropriedadeNumerica(
      abandonosUltimoPeriodo,
      "usuarios_coorte_nao_aderiram_perc"
    );

    return (
      <>
        <GraficoInfo
          titulo="Taxa de não adesão acumulada"
          tooltip="Dos usuários que entraram no início do período indicado, porcentagem que deixou de frequentar nos três meses seguintes (não aderiu ao serviço)"
          descricao={ `Conjunto de usuários com 1° procedimento em ${abandonosUltimoPeriodo[0].a_partir_do_mes}/${abandonosUltimoPeriodo[0].a_partir_do_ano} e não adesão até ${abandonosUltimoPeriodo[0].ate_mes}/${abandonosUltimoPeriodo[0].ate_ano}` }
          fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
        />

        <Grid12Col
          items={
            abandonosOrdenadosPorValor.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.usuarios_coorte_nao_aderiram_perc }
                indicadorSimbolo="%"
                key={ uuidv1() }
              />
            ))
          }
          proporcao="4-4-4"
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

  const agregadosPorCID = useMemo(() => {
    const dadosAgregados = agregarPorCondicaoSaude(
      evasoesNoMesPorCID,
      "usuario_condicao_saude",
      "quantidade_registrada"
    );
    const dadosNaoZerados = dadosAgregados.filter(({ quantidade }) => quantidade !== 0);
    const dadosOrdenados = ordenarDecrescentePorPropriedadeNumerica(dadosNaoZerados, "quantidade");

    return dadosOrdenados;
  }, [evasoesNoMesPorCID]);

  const agregadosPorGeneroEFaixaEtaria = useMemo(() => {
    return agregarPorFaixaEtariaEGenero(
      evasoesNoMesPorGeneroEIdade,
      "usuario_faixa_etaria",
      "usuario_sexo",
      "quantidade_registrada"
    );
  }, [evasoesNoMesPorGeneroEIdade]);


  // const agregadosPorRacaCor = agregarPorRacaCor(
  //   filtrarPorPeriodoEstabelecimento(abandonoPerfil, filtroEstabelecimentoRacaECor, filtroPeriodoRacaECor),
  //   "usuario_raca_cor",
  //   "quantidade_registrada"
  // );

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Taxa de não adesão</strong>"
      />

      { abandonoCoortes.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${abandonoCoortes
                .find((item) =>
                  item.estabelecimento === "Todos"
                  && item.periodo === "Último período"
                )
                .nome_mes
                }` }
            />

            { getCardsAbandonoAcumulado(abandonoCoortes) }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Histórico Temporal - Taxa mensal"
        descricao="Dos usuários acolhidos há menos de 3 meses, quantos não aderiram ao serviço no mês"
        tooltip="Diferente do indicador de não adesão acumulado, que mostra o percentual de usuários que iniciaram o vínculo em um determinado mês e em até 3 meses deixaram de frequentar o CAPS, a taxa de não adesão mensal mostra o percentual de usuários recentes que deixaram de frequentar o serviço em um mês específico. Ou seja, o indicador mensal mostra qual foi o mês que o usuário iniciou o período de inatividade (que precisa ser igual ou superior a 3 meses)."
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
        destaque="Por que esses valores são diferentes?"
      />

      { abandonoMensal.length !== 0
        ? (
          <>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  abandonoMensal,
                  filtroEstabelecimentoHistorico,
                  setFiltroEstabelecimentoHistorico
                )
              } />
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoHistoricoTemporal(
                filtrarPorEstabelecimento(abandonoMensal, filtroEstabelecimentoHistorico),
                "usuarios_evasao_perc",
                "Taxa de não adesão mensal (%):"
              ) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      }


      <GraficoInfo
        titulo="CID dos usuários que não aderiram ao serviço"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { evasoesNoMesPorCID
        && periodos.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroEstabelecimento(
                    estabelecimentos,
                    filtroEstabelecimentoCID,
                    setFiltroEstabelecimentoCID
                  )
                } />
              </div>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroPeriodo(
                    periodos,
                    filtroPeriodoCID,
                    setFiltroPeriodoCID,
                    false
                  )
                } />
              </div>
            </div>

            { loadingCID
              ? <Spinner theme="ColorSM" height="70vh" />
              : <div className={ styles.GraficoCIDContainer }>
                <ReactEcharts
                  option={ getOpcoesGraficoCID(agregadosPorCID) }
                  style={ { width: "50%", height: "70vh" } }
                />

                <TabelaCid
                  labels={ {
                    colunaCid: "Grupo de diagnósticos",
                    colunaQuantidade: "Abandonaram no mês",
                  } }
                  cids={ agregadosPorCID }
                />
              </div>
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { evasoesNoMesPorGeneroEIdade
        && periodos.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroEstabelecimento(
                    estabelecimentos,
                    filtroEstabelecimentoGenero,
                    setFiltroEstabelecimentoGenero
                  )
                } />
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
              ? <Spinner theme='ColorSM' height='70vh' />
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

      {/* <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { abandonoPerfil.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  abandonoPerfil,
                  filtroEstabelecimentoRacaECor,
                  setFiltroEstabelecimentoRacaECor
                )
              } />
            </div>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  abandonoPerfil,
                  filtroPeriodoRacaECor,
                  setFiltroPeriodoRacaECor
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoRacaEcor(
              agregadosPorRacaCor,
              "Usuários recentes que abandonaram no período"
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        descricao="*Dados podem ter problemas de coleta, registro e preenchimento"
      /> */}
    </div>
  );
};

export default TaxaAbandono;
