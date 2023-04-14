import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAtendimentosPorCaps, getPerfilDeAtendimentos, getResumoPerfilDeAtendimentos } from "../../../requests/caps";
import { CORES_GRAFICO_DONUT } from "../../../constants/CORES_GRAFICO_DONUT";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import styles from "../Caps.module.css";
import perfilJSON from "./perfil.json";
import porCapsJSON from "./porCaps.json";

const FILTRO_PERIODO_MULTI_DEFAULT = [
  { value: "Último período", label: "Último período" },
];

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
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroPeriodoCID, setFiltroPeriodoCID] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroPeriodoRacaECor, setFiltroPeriodoRacaECor] = useState(FILTRO_PERIODO_MULTI_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setPerfilAtendimentos(await getPerfilDeAtendimentos(municipioIdSus));
      // setResumoPerfilAtendimentos(
      //   await getResumoPerfilDeAtendimentos(municipioIdSus)[0]
      // );
      setAtendimentosPorCaps(await getAtendimentosPorCaps(municipioIdSus));
      // setAtendimentosPorCaps(porCapsJSON);
      // setPerfilAtendimentos(perfilJSON);
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
      .filter(({ periodo, estabelecimento }) => periodo === "Último período" && estabelecimento !== "Todos");

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

  const agregarPorEstabelecimentoEPeriodo = (atendimentos) => {
    const atendimentosAgregados = [];

    atendimentos.forEach((atendimento) => {
      const {
        periodo,
        competencia,
        estabelecimento,
        perc_apenas_atendimentos_individuais: porcentagemAtendimentos,
      } = atendimento;

      const estabelecimentoEncontrado = atendimentosAgregados
        .find((item) => item.estabelecimento === estabelecimento);

      if (!estabelecimentoEncontrado) {
        atendimentosAgregados.push({
          estabelecimento,
          atendimentosPorPeriodo: [{
            periodo,
            competencia,
            porcentagemAtendimentos
          }]
        });
      } else {
        estabelecimentoEncontrado.atendimentosPorPeriodo.push({
          periodo,
          competencia,
          porcentagemAtendimentos
        });
      }
    });

    return atendimentosAgregados;
  };

  const ordenarAtendimentosPorCompetenciaAsc = (atendimentos) => {
    return atendimentos.map(({ estabelecimento, atendimentosPorPeriodo }) => ({
      estabelecimento,
      atendimentosPorPeriodo: atendimentosPorPeriodo
        .sort((a, b) => new Date(a.competencia) - new Date(b.competencia))
    }));
  };

  const getOpcoesGraficoHistoricoTemporal = (atendimentos, filtroEstabelecimento) => {
    const atendimentosAgregados = agregarPorEstabelecimentoEPeriodo(atendimentos);
    const atendimentosOrdenados = ordenarAtendimentosPorCompetenciaAsc(atendimentosAgregados);
    const atendimentosDeEstabelecimentoFiltrado = atendimentosOrdenados
      .find(({ estabelecimento }) => estabelecimento === filtroEstabelecimento);

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
            title: "Salvar como imagem",
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
        data: atendimentosDeEstabelecimentoFiltrado.atendimentosPorPeriodo
          .map(({ periodo }) => periodo)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: "Usuários que realizaram apenas atendimentos individuais entre os que frequentaram no mês (%):",
          data: atendimentosDeEstabelecimentoFiltrado.atendimentosPorPeriodo
            .map(({ porcentagemAtendimentos }) => porcentagemAtendimentos),
          type: 'line',
          itemStyle: {
            color: "#5367C9"
          },
        }
      ]
    };
  };

  const agregarPorCondicaoSaude = (perfilDeAtendimento) => {
    const dadosAgregados = [];

    perfilDeAtendimento.forEach((dado) => {
      const {
        usuarios_apenas_atendimento_individual: quantidadeUsuarios,
        usuario_condicao_saude: condicaoSaude
      } = dado;

      const condicaoSaudeDados = dadosAgregados
        .find((item) => item.condicaoSaude === condicaoSaude);

      if (!condicaoSaudeDados) {
        dadosAgregados.push({
          condicaoSaude,
          quantidadeUsuarios
        });
      } else {
        condicaoSaudeDados.quantidadeUsuarios += quantidadeUsuarios;
      }
    });

    return dadosAgregados;
  };

  const filtrarPorEstabelecimentosTodosEPeriodos = (dados, filtroPeriodo) => {
    const periodosSelecionados = filtroPeriodo.map(({ value }) => value);

    return dados.filter((item) =>
      item.estabelecimento === "Todos"
      && periodosSelecionados.includes(item.periodo)
    );
  };

  const getOpcoesGraficoCID = (perfilDeAtendimento, filtroPeriodo) => {
    const dadosAtendimentoFiltrados = filtrarPorEstabelecimentosTodosEPeriodos(
      perfilDeAtendimento,
      filtroPeriodo
    );
    const agregadosPorCondicaoSaude = agregarPorCondicaoSaude(dadosAtendimentoFiltrados);

    return {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            formatter: "{d}%",
            color: "#000000"
          },
          emphasis: {
            label: {
              show: true,
            }
          },
          labelLine: {
            show: false
          },
          data: agregadosPorCondicaoSaude
            .map(({ condicaoSaude, quantidadeUsuarios }, index) => ({
              value: quantidadeUsuarios,
              name: !condicaoSaude ? "Sem informação" : condicaoSaude,
              itemStyle: {
                color: CORES_GRAFICO_DONUT[index]
              },
            }))
        }
      ]
    };
  };

  const agregarPorFaixaEtariaEGenero = (perfilDeAtendimento) => {
    const dadosAgregados = [];

    perfilDeAtendimento.forEach((dado) => {
      const {
        usuarios_apenas_atendimento_individual: quantidadeUsuarios,
        usuario_faixa_etaria_descricao: faixaEtaria,
        usuario_sexo: usuarioSexo
      } = dado;
      const genero = usuarioSexo.toLowerCase();
      const faixaEtariaDados = dadosAgregados
        .find((item) => item.faixaEtaria === faixaEtaria);

      if (!faixaEtariaDados) {
        dadosAgregados.push({
          faixaEtaria,
          [genero]: quantidadeUsuarios
        });
      } else {
        faixaEtariaDados[genero]
          ? faixaEtariaDados[genero] += quantidadeUsuarios
          : faixaEtariaDados[genero] = quantidadeUsuarios;
      }
    });

    return dadosAgregados;
  };

  const getOpcoesGraficoGeneroEFaixaEtaria = (perfilDeAtendimento, filtroPeriodo) => {
    const NOME_DIMENSAO = "genero";
    const LABELS_DIMENSAO = ["Masculino", "Feminino"];

    const dadosAtendimentoFiltrados = filtrarPorEstabelecimentosTodosEPeriodos(
      perfilDeAtendimento,
      filtroPeriodo
    );

    const agregadosPorGeneroEFaixaEtaria = agregarPorFaixaEtariaEGenero(dadosAtendimentoFiltrados);

    return {
      legend: {
        itemGap: 25,
      },
      tooltip: {},
      dataset: {
        dimensions: [NOME_DIMENSAO, ...LABELS_DIMENSAO],
        source: agregadosPorGeneroEFaixaEtaria
          .sort((a, b) => a.faixaEtaria.localeCompare(b.faixaEtaria))
          .map((item) => ({
            [NOME_DIMENSAO]: item.faixaEtaria,
            [LABELS_DIMENSAO[0]]: item[LABELS_DIMENSAO[0].toLowerCase()],
            [LABELS_DIMENSAO[1]]: item[LABELS_DIMENSAO[1].toLowerCase()],
          })),
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          itemStyle: {
            color: "#FA81E6"
          },
          label: {
            show: true,
            position: 'inside',
            formatter: `{@${LABELS_DIMENSAO[0]}}`,
            color: "#FFFFFF",
          },
        },
        {
          type: 'bar',
          itemStyle: {
            color: "#5367C9"
          },
          label: {
            show: true,
            position: 'inside',
            formatter: `{@${LABELS_DIMENSAO[1]}}`,
            color: "#FFFFFF",
          },
        }
      ]
    };
  };

  const agregarPorRacaCor = (perfilDeAtendimento) => {
    const dadosAgregados = [];

    perfilDeAtendimento.forEach((dado) => {
      const {
        usuarios_apenas_atendimento_individual: quantidadeUsuarios,
        usuario_raca_cor: racaCor
      } = dado;
      const racaCorDados = dadosAgregados
        .find((item) => item.racaCor === racaCor);

      if (!racaCorDados) {
        dadosAgregados.push({
          racaCor,
          quantidadeUsuarios
        });
      } else {
        racaCorDados.quantidadeUsuarios += quantidadeUsuarios;
      }
    });

    return dadosAgregados;
  };

  const getOpcoesGraficoRacaEcor = (perfilDeAtendimento, filtroPeriodo) => {
    const NOME_DIMENSAO = "usuariosAtendimentosIndividuais";
    const LABEL_DIMENSAO = "Usuários que realizaram apenas atendimentos individuais";

    const dadosAtendimentoFiltrados = filtrarPorEstabelecimentosTodosEPeriodos(
      perfilDeAtendimento,
      filtroPeriodo
    );

    const agregadosPorRacaCor = agregarPorRacaCor(dadosAtendimentoFiltrados);

    return {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: [NOME_DIMENSAO, LABEL_DIMENSAO],
        source: agregadosPorRacaCor
          .sort((a, b) => b.racaCor.localeCompare(a.racaCor))
          .map((item) => ({
            [NOME_DIMENSAO]: item.racaCor,
            [LABEL_DIMENSAO]: item.quantidadeUsuarios,
          })),
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          itemStyle: {
            color: "#5367C9"
          },
        },
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
        titulo="<strong>Atendimentos individuais </strong>"
      />

      <GraficoInfo
        descricao="Taxa dos usuários frequentantes no mês que realizaram apenas atendimentos individuais"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      {
        atendimentosPorCaps.length !== 0
        && getCardsAtendimentosPorCaps(atendimentosPorCaps)
      }

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { atendimentosPorCaps.length !== 0 &&
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
              atendimentosPorCaps,
              filtroEstabelecimentoHistorico.value
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="CID dos usuários que realizaram apenas atendimentos individuais"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfilAtendimentos.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroPeriodo(
                perfilAtendimentos,
                filtroPeriodoCID,
                setFiltroPeriodoCID
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoCID(perfilAtendimentos, filtroPeriodoCID) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfilAtendimentos.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroPeriodo(
                perfilAtendimentos,
                filtroPeriodoGenero,
                setFiltroPeriodoGenero
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoGeneroEFaixaEtaria(
              perfilAtendimentos,
              filtroPeriodoGenero
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfilAtendimentos.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroPeriodo(
                perfilAtendimentos,
                filtroPeriodoRacaECor,
                setFiltroPeriodoRacaECor
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoRacaEcor(
              perfilAtendimentos,
              filtroPeriodoRacaECor
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        descricao="*Dados podem ter problemas de coleta, registro e preenchimento"
      />
    </div>
  );
};

export default AtendimentoIndividual;
