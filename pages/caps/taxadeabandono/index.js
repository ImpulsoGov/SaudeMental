import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAbandonoCoortes, getPerfilAbandono } from "../../../requests/caps";

import ReactEcharts from "echarts-for-react";
import Select from "react-select";
import { CORES_GRAFICO_DONUT } from "../../../constants/CORES_GRAFICO_DONUT";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import styles from "../Caps.module.css";
import coortesJSON from "./coortes.json";
import perfilJSON from "./perfil.json";

const FILTRO_PERIODO_MULTI_DEFAULT = [
  { value: "Último período", label: "Último período" },
];

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const TaxaAbandono = () => {
  const { data: session } = useSession();
  // const [abandonoCoortes, setAbandonoCoortes] = useState(coortesJSON);
  // const [abandonoPerfil, setAbandonoPerfil] = useState(perfilJSON);
  const [abandonoCoortes, setAbandonoCoortes] = useState([]);
  const [abandonoPerfil, setAbandonoPerfil] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroPeriodoCID, setFiltroPeriodoCID] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroPeriodoRacaECor, setFiltroPeriodoRacaECor] = useState(FILTRO_PERIODO_MULTI_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAbandonoCoortes(await getAbandonoCoortes(municipioIdSus));
      setAbandonoPerfil(await getPerfilAbandono(municipioIdSus));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const getCardsAbandonoAcumulado = (abandonos) => {
    const abandonosUltimoPeriodo = abandonos
      .filter(({ periodo, estabelecimento }) => periodo === "Último período" && estabelecimento !== "Todos");

    return (
      <>
        <GraficoInfo
          titulo="Abandono acumulado"
          tooltip="Dos usuários que entraram no início do período indicado, porcentagem que abandonou o serviço nos seis meses seguintes"
          descricao={ `Conjunto de usuários com 1° procedimento em ${abandonosUltimoPeriodo[0].a_partir_do_mes}/${abandonosUltimoPeriodo[0].a_partir_do_ano} e abandono até ${abandonosUltimoPeriodo[0].ate_mes}/${abandonosUltimoPeriodo[0].ate_ano}` }
          fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
        />

        <Grid12Col
          items={
            abandonosUltimoPeriodo.map((item) => (
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

  const getOpcoesGraficoHistoricoTemporal = (abandonoCoortes, filtroEstabelecimento) => {
    const filtradosPorEstabelecimento = abandonoCoortes
      .filter(({ estabelecimento }) =>
        estabelecimento === filtroEstabelecimento
      );

    const ordenadosPorCompetenciaAsc = filtradosPorEstabelecimento
      .sort((a, b) => new Date(a.competencia) - new Date(b.competencia));

    const periodos = ordenadosPorCompetenciaAsc.map(({ periodo }) => periodo);
    const porcentagensNaoAdesaoPorPeriodo = ordenadosPorCompetenciaAsc
      .map(({ usuarios_coorte_nao_aderiram_perc: porcentagemNaoAdesao }) =>
        porcentagemNaoAdesao
      );

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
        data: periodos
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: "Taxa de abandono mensal (%):",
          data: porcentagensNaoAdesaoPorPeriodo,
          type: 'line',
          itemStyle: {
            color: "#5367C9"
          },
        }
      ]
    };
  };

  const agregarPorCondicaoSaude = (perfilDeAbandono) => {
    const dadosAgregados = [];

    perfilDeAbandono.forEach((dado) => {
      const {
        quantidade_registrada: quantidadeUsuarios,
        grupo_descricao_curta_cid10: condicaoSaude
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

  const filtrarDadosPorPeriodos = (dados, filtroPeriodo) => {
    const periodosSelecionados = filtroPeriodo.map(({ value }) => value);

    return dados.filter((item) => periodosSelecionados.includes(item.periodo));
  };

  const getOpcoesGraficoCID = (perfilDeAbandono, filtroPeriodo) => {
    const dadosAbandonoFiltrados = filtrarDadosPorPeriodos(perfilDeAbandono, filtroPeriodo);
    const agregadosPorCondicaoSaude = agregarPorCondicaoSaude(dadosAbandonoFiltrados);

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

  const agregarPorFaixaEtariaEGenero = (perfilDeAbandono) => {
    const dadosAgregados = [];

    perfilDeAbandono.forEach((dado) => {
      const {
        quantidade_registrada: quantidadeUsuarios,
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

  const getOpcoesGraficoGeneroEFaixaEtaria = (perfilDeAbandono, filtroPeriodo) => {
    const NOME_DIMENSAO = "genero";
    const LABELS_DIMENSAO = ["Masculino", "Feminino"];

    const dadosAbandonoFiltrados = filtrarDadosPorPeriodos(perfilDeAbandono, filtroPeriodo);

    const agregadosPorGeneroEFaixaEtaria = agregarPorFaixaEtariaEGenero(dadosAbandonoFiltrados);

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

  const agregarPorRacaCor = (perfilDeAbandono) => {
    const dadosAgregados = [];

    perfilDeAbandono.forEach((dado) => {
      const {
        quantidade_registrada: quantidadeUsuarios,
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

  const getOpcoesGraficoRacaEcor = (perfilDeAbandono, filtroPeriodo) => {
    const NOME_DIMENSAO = "usuariosAbandonaram";
    const LABEL_DIMENSAO = "Usuários recentes que abandonaram no período";

    const dadosAbandonoFiltrados = filtrarDadosPorPeriodos(perfilDeAbandono, filtroPeriodo);

    const agregadosPorRacaCor = agregarPorRacaCor(dadosAbandonoFiltrados);

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
        titulo="<strong>Taxa de não adesão</strong>"
      />

      { abandonoCoortes.length !== 0 &&
        getCardsAbandonoAcumulado(abandonoCoortes)
      }

      <GraficoInfo
        titulo="Histórico Temporal"
        descricao="Dos usuários acolhidos há menos de 6 meses, quantos abandonaram o serviço no mês"
        tooltip="A taxa de não adesão acumulado se refere à porcentagem de usuários que entraram no serviço em um dado mês e abandonaram o serviço em algum dos 6 meses seguintes. A taxa de não adesão mensal se refere à quantidade de usuários que haviam entrado no serviço recentemente e abandonaram o serviço no mês especificado."
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { abandonoCoortes.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroEstabelecimento(
                abandonoCoortes,
                filtroEstabelecimentoHistorico,
                setFiltroEstabelecimentoHistorico
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoHistoricoTemporal(
              abandonoCoortes,
              filtroEstabelecimentoHistorico.value
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="CID dos usuários que abandonaram o serviço"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { abandonoPerfil.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroPeriodo(
                abandonoPerfil,
                filtroPeriodoCID,
                setFiltroPeriodoCID
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoCID(abandonoPerfil, filtroPeriodoCID) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { abandonoPerfil.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroPeriodo(
                abandonoPerfil,
                filtroPeriodoGenero,
                setFiltroPeriodoGenero
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoGeneroEFaixaEtaria(
              abandonoPerfil,
              filtroPeriodoGenero
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { abandonoPerfil.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroPeriodo(
                abandonoPerfil,
                filtroPeriodoRacaECor,
                setFiltroPeriodoRacaECor
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoRacaEcor(
              abandonoPerfil,
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

export default TaxaAbandono;
