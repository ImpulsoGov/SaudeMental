import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { v1 as uuidv1 } from "uuid";
import { CORES_GRAFICO_DONUT } from "../../../constants/CORES_GRAFICO_DONUT";
import { CORES_GRAFICO_SUBST_MORADIA } from "../../../constants/CORES_GRAFICO_SUBST_MORADIA";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { getNovosUsuarios, getResumoNovosUsuarios } from "../../../requests/caps";
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

const NovoUsuario = () => {
  const { data: session } = useSession();
  const [novosUsuarios, setNovosUsusarios] = useState([]);
  const [resumoNovosUsuarios, setResumoNovosUsuarios] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoPerfil, setFiltroPeriodoPerfil] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoPerfil, setFiltroEstabelecimentoPerfil] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoSubstEMoradia, setFiltroPeriodoSubstEMoradia] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoSubstEMoradia, setFiltroEstabelecimentoSubstEMoradia] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoRacaECor, setFiltroPeriodoRacaECor] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoRacaECor, setFiltroEstabelecimentoRacaECor] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setNovosUsusarios(await getNovosUsuarios(municipioIdSus));
      setResumoNovosUsuarios(
        await getResumoNovosUsuarios(municipioIdSus)
      );
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const agregarPorLinhaPerfil = (usuariosNovos) => {
    const usuariosAgregados = [];

    usuariosNovos.forEach((item) => {
      const {
        estabelecimento,
        nome_mes: nomeMes,
        estabelecimento_linha_perfil: linhaPerfil,
        usuarios_novos: usuariosNovos,
        dif_usuarios_novos_anterior: diferencaMesAnterior
      } = item;

      const linhaPerfilEncontrada = usuariosAgregados
        .find((item) => item.linhaPerfil === linhaPerfil);

      if (!linhaPerfilEncontrada) {
        usuariosAgregados.push({
          nomeMes,
          linhaPerfil,
          usuariosPorEstabelecimento: [{
            estabelecimento,
            usuariosNovos,
            diferencaMesAnterior
          }]
        });
      } else {
        linhaPerfilEncontrada.usuariosPorEstabelecimento.push({
          estabelecimento,
          usuariosNovos,
          diferencaMesAnterior
        });
      }
    });

    return usuariosAgregados;
  };

  const getCardsNovosUsuariosPorEstabelecimento = (novosUsuarios) => {
    const novosUsuariosUltimoPeriodo = novosUsuarios
      .filter(({
        periodo,
        estabelecimento,
        estabelecimento_linha_perfil: linhaPerfil,
        estabelecimento_linha_idade: linhaIdade
      }) =>
        periodo === "Último período"
        && estabelecimento !== "Todos"
        && linhaPerfil !== "Todos"
        // && linhaIdade === "Todos"
      );

    const usuariosAgregados = agregarPorLinhaPerfil(novosUsuariosUltimoPeriodo);

    const cards = usuariosAgregados.map(({
      linhaPerfil, usuariosPorEstabelecimento, nomeMes
    }) => (
      <>
        <GraficoInfo
          titulo={ `CAPS ${linhaPerfil}` }
          fonte={ `Dados de ${nomeMes}` }
        />

        <Grid12Col
          items={
            usuariosPorEstabelecimento.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.usuariosNovos }
                indice={ item.diferencaMesAnterior }
                indiceDescricao="últ. mês"
                key={ uuidv1() }
              />
            ))
          }
          proporcao="3-3-3-3"
        />
      </>
    ));

    return cards;
  };

  const getOpcoesGraficoHistoricoTemporal = (novosUsuarios, filtroEstabelecimento) => {
    const filtradosPorEstabelecimento = novosUsuarios
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento
        // && item.estabelecimento_linha_perfil === "Todos"
        // && item.estabelecimento_linha_idade === "Todos"
      );
    console.log("filtroEstabelecimento", filtroEstabelecimento);
    console.log("filtradosPorEstabelecimento", filtradosPorEstabelecimento);

    const ordenadosPorCompetenciaAsc = filtradosPorEstabelecimento
      .sort((a, b) => new Date(a.competencia) - new Date(b.competencia));

    const periodos = ordenadosPorCompetenciaAsc.map(({ periodo }) => periodo);
    const quantidadesUsuariosNovos = ordenadosPorCompetenciaAsc
      .map(({ usuarios_novos: usuariosNovos }) => usuariosNovos);

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
          name: "Usuários novos:",
          data: quantidadesUsuariosNovos,
          type: 'line',
          itemStyle: {
            color: "#5367C9"
          },
        }
      ]
    };
  };

  const agregarPorCondicaoSaude = (novosUsuarios) => {
    const usuariosAgregados = [];

    novosUsuarios.forEach((dado) => {
      const {
        usuarios_novos: usuariosNovos,
        usuario_condicao_saude: condicaoSaude
      } = dado;

      const condicaoSaudeDados = usuariosAgregados
        .find((item) => item.condicaoSaude === condicaoSaude);

      if (!condicaoSaudeDados) {
        usuariosAgregados.push({
          condicaoSaude,
          usuariosNovos
        });
      } else {
        condicaoSaudeDados.usuariosNovos += usuariosNovos;
      }
    });

    return usuariosAgregados;
  };

  const filtrarDadosGeraisPorPeriodo = (dados, filtroEstabelecimento, filtroPeriodo) => {
    const periodosSelecionados = filtroPeriodo.map(({ value }) => value);

    return dados.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && periodosSelecionados.includes(item.periodo)
      && item.estabelecimento_linha_perfil === "Todos"
      && item.estabelecimento_linha_idade === "Todos"
    );
  };

  const getOpcoesGraficoPerfil = (novosUsuarios, filtroEstabelecimento, filtroPeriodo) => {
    const dadosUsuariosFiltrados = filtrarDadosGeraisPorPeriodo(
      novosUsuarios,
      filtroEstabelecimento,
      filtroPeriodo
    );

    const agregadosPorCondicaoSaude = agregarPorCondicaoSaude(dadosUsuariosFiltrados);

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
          data: agregadosPorCondicaoSaude.map(({ condicaoSaude, usuariosNovos }, index) => ({
            value: usuariosNovos,
            name: !condicaoSaude ? "Sem informação" : condicaoSaude,
            itemStyle: {
              color: CORES_GRAFICO_DONUT[index]
            },
          }))
        }
      ]
    };
  };

  const agregarPorFaixaEtariaEGenero = (novosUsusarios) => {
    const usuariosAgregados = [];

    novosUsusarios.forEach((dado) => {
      const {
        usuarios_novos: usuariosNovos,
        usuario_faixa_etaria: faixaEtaria,
        usuario_sexo: usuarioSexo
      } = dado;
      const genero = usuarioSexo.toLowerCase();
      const faixaEtariaDados = usuariosAgregados
        .find((item) => item.faixaEtaria === faixaEtaria);

      if (!faixaEtariaDados) {
        usuariosAgregados.push({
          faixaEtaria,
          [genero]: usuariosNovos
        });
      } else {
        faixaEtariaDados[genero]
          ? faixaEtariaDados[genero] += usuariosNovos
          : faixaEtariaDados[genero] = usuariosNovos;
      }
    });

    return usuariosAgregados;
  };

  const getOpcoesGraficoGeneroEFaixaEtaria = (novosUsuarios, filtroEstabelecimento, filtroPeriodo) => {
    const NOME_DIMENSAO = "genero";
    const LABELS_DIMENSAO = ["Masculino", "Feminino"];

    const dadosUsuariosFiltrados = filtrarDadosGeraisPorPeriodo(
      novosUsuarios,
      filtroEstabelecimento,
      filtroPeriodo
    );

    const agregadosPorGeneroEFaixaEtaria = agregarPorFaixaEtariaEGenero(dadosUsuariosFiltrados);

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
        name: "Faixa etária (em anos)",
        nameLocation: "center",
        nameGap: 45,
      },
      yAxis: {
        name: "Usuários novos",
        nameLocation: "center",
        nameGap: 55,
      },
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

  const agregarPorAbusoSubstancias = (usuariosNovos) => {
    const usuariosAgregados = [];

    usuariosNovos.forEach((dado) => {
      const {
        usuarios_novos: usuariosNovos,
        usuario_abuso_substancias: abusoSubstancias
      } = dado;
      const abusoSubstanciasDados = usuariosAgregados
        .find((item) => item.abusoSubstancias === abusoSubstancias);

      if (!abusoSubstanciasDados) {
        usuariosAgregados.push({
          abusoSubstancias,
          usuariosNovos
        });
      } else {
        abusoSubstanciasDados.usuariosNovos += usuariosNovos;
      }
    });

    return usuariosAgregados;
  };

  const agregarPorSituacaoRua = (usuariosNovos) => {
    const usuariosAgregados = [];

    usuariosNovos.forEach((dado) => {
      const {
        usuarios_novos: usuariosNovos,
        usuario_situacao_rua: situacaoRua,
      } = dado;
      const situacaoRuaDados = usuariosAgregados
        .find((item) => item.situacaoRua === situacaoRua);

      if (!situacaoRuaDados) {
        usuariosAgregados.push({
          situacaoRua,
          usuariosNovos
        });
      } else {
        situacaoRuaDados.usuariosNovos += usuariosNovos;
      }
    });

    return usuariosAgregados;
  };

  const getOpcoesGraficoAbusoESituacao = (novosUsuarios, titulo, tipo, filtroEstabelecimento, filtroPeriodo) => {
    const PROPIEDADES_POR_TIPO = {
      SITUACAO_RUA: "situacaoRua",
      ABUSO_SUBSTANCIAS: "abusoSubstancias"
    };

    const propriedade = PROPIEDADES_POR_TIPO[tipo];

    const dadosUsuariosFiltrados = filtrarDadosGeraisPorPeriodo(
      novosUsuarios,
      filtroEstabelecimento,
      filtroPeriodo
    );

    const dadosUsuariosAgregados = tipo === "SITUACAO_RUA"
      ? agregarPorSituacaoRua(dadosUsuariosFiltrados)
      : agregarPorAbusoSubstancias(dadosUsuariosFiltrados);

    return {
      title: {
        text: titulo,
        textStyle: {
          fontSize: 14
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0
      },
      series: [
        {
          top: 30,
          bottom: 30,
          name: titulo,
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
          data: dadosUsuariosAgregados.map((item, index) => ({
            value: item.usuariosNovos,
            name: item[propriedade],
            itemStyle: {
              color: CORES_GRAFICO_SUBST_MORADIA[index]
            },
          }))
        }
      ]
    };
  };

  const agregarPorRacaCor = (novosUsuarios) => {
    const usuariosAgregados = [];

    novosUsuarios.forEach((dado) => {
      const {
        usuarios_novos: usuariosNovos,
        usuario_raca_cor: racaCor
      } = dado;
      const racaCorDados = usuariosAgregados
        .find((item) => item.racaCor === racaCor);

      if (!racaCorDados) {
        usuariosAgregados.push({
          racaCor,
          usuariosNovos
        });
      } else {
        racaCorDados.usuariosNovos += usuariosNovos;
      }
    });

    return usuariosAgregados;
  };

  const getOpcoesGraficoRacaEcor = (novosUsuarios, filtroEstabelecimento, filtroPeriodo) => {
    const NOME_DIMENSAO = "usuariosNovos";
    const LABEL_DIMENSAO = "Usuários novos no período";

    const dadosUsuariosFiltrados = filtrarDadosGeraisPorPeriodo(
      novosUsuarios,
      filtroEstabelecimento,
      filtroPeriodo
    );

    const agregadosPorRacaCor = agregarPorRacaCor(dadosUsuariosFiltrados);

    return {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: [NOME_DIMENSAO, LABEL_DIMENSAO],
        source: agregadosPorRacaCor
          .sort((a, b) => b.racaCor.localeCompare(a.racaCor))
          .map((item) => ({
            [NOME_DIMENSAO]: item.racaCor,
            [LABEL_DIMENSAO]: item.usuariosNovos,
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
        titulo="<strong>Novos usuários</strong>"
      />

      <GraficoInfo
        descricao="Taxa de novos usuários que passaram por primeiro procedimento (registrado em RAAS), excluindo-se usuários que passaram apenas por acolhimento inicial."
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      {
        resumoNovosUsuarios.length !== 0
        && getCardsNovosUsuariosPorEstabelecimento(resumoNovosUsuarios)
      }

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { resumoNovosUsuarios.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroEstabelecimento(
                resumoNovosUsuarios,
                filtroEstabelecimentoHistorico,
                setFiltroEstabelecimentoHistorico
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoHistoricoTemporal(
              resumoNovosUsuarios,
              filtroEstabelecimentoHistorico.value
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Perfil dos novos usuários"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { novosUsuarios.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  novosUsuarios,
                  filtroEstabelecimentoPerfil,
                  setFiltroEstabelecimentoPerfil
                )
              } />
            </div>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  novosUsuarios,
                  filtroPeriodoPerfil,
                  setFiltroPeriodoPerfil
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoPerfil(
              novosUsuarios,
              filtroEstabelecimentoPerfil,
              filtroPeriodoPerfil
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { novosUsuarios.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  novosUsuarios,
                  filtroEstabelecimentoGenero,
                  setFiltroEstabelecimentoGenero
                )
              } />
            </div>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  novosUsuarios,
                  filtroPeriodoGenero,
                  setFiltroPeriodoGenero
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoGeneroEFaixaEtaria(
              novosUsuarios,
              filtroEstabelecimentoGenero,
              filtroPeriodoGenero
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Uso de substâncias e condição de moradia"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { novosUsuarios.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  novosUsuarios,
                  filtroEstabelecimentoSubstEMoradia,
                  setFiltroEstabelecimentoSubstEMoradia
                )
              } />
            </div>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  novosUsuarios,
                  filtroPeriodoSubstEMoradia,
                  setFiltroPeriodoSubstEMoradia
                )
              } />
            </div>
          </div>

          <div className={ styles.GraficosUsuariosAtivosContainer }>
            <div className={ styles.GraficoUsuariosAtivos }>
              <ReactEcharts
                option={ getOpcoesGraficoAbusoESituacao(
                  novosUsuarios,
                  "Fazem uso de substâncias psicoativas?",
                  "ABUSO_SUBSTANCIAS",
                  filtroEstabelecimentoSubstEMoradia,
                  filtroPeriodoSubstEMoradia
                ) }
                style={ { width: "100%", height: "100%" } }
              />
            </div>

            <div className={ styles.GraficoUsuariosAtivos }>
              <ReactEcharts
                option={ getOpcoesGraficoAbusoESituacao(
                  novosUsuarios,
                  "Estão em situação de rua?",
                  "SITUACAO_RUA",
                  filtroEstabelecimentoSubstEMoradia,
                  filtroPeriodoSubstEMoradia
                ) }
                style={ { width: "100%", height: "100%" } }
              />
            </div>
          </div>
        </>
      }

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { novosUsuarios.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  novosUsuarios,
                  filtroEstabelecimentoRacaECor,
                  setFiltroEstabelecimentoRacaECor
                )
              } />
            </div>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  novosUsuarios,
                  filtroPeriodoRacaECor,
                  setFiltroPeriodoRacaECor
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoRacaEcor(
              novosUsuarios,
              filtroEstabelecimentoRacaECor,
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

export default NovoUsuario;
