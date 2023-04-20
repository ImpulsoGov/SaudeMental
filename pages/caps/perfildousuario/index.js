import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { CORES_GRAFICO_DONUT } from "../../../constants/CORES_GRAFICO_DONUT";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import styles from "../Caps.module.css";

import { CORES_GRAFICO_SUBST_MORADIA } from "../../../constants/CORES_GRAFICO_SUBST_MORADIA";
import { getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { getPerfilUsuarios, getPerfilUsuariosPorEstabelecimento } from "../../../requests/caps";

const FILTRO_COMPETENCIA_VALOR_PADRAO = { value: "Último período", label: "Último período" };
const FILTRO_ESTABELECIMENTO_VALOR_PADRAO = { value: "Todos", label: "Todos" };

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const PerfilUsuario = () => {
  const { data: session } = useSession();
  const [perfil, setPerfil] = useState([]);
  const [perfilPorEstabelecimento, setPerfilPorEstabelecimento] = useState([]);
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState(FILTRO_ESTABELECIMENTO_VALOR_PADRAO);
  const [filtroCompetenciaCID, setFiltroCompetenciaCID] = useState(FILTRO_COMPETENCIA_VALOR_PADRAO);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_VALOR_PADRAO);
  const [filtroCompetenciaGenero, setFiltroCompetenciaGenero] = useState(FILTRO_COMPETENCIA_VALOR_PADRAO);
  const [filtroEstabelecimentoRacaCor, setFiltroEstabelecimentoRacaCor] = useState(FILTRO_ESTABELECIMENTO_VALOR_PADRAO);
  const [filtroCompetenciaRacaCor, setFiltroCompetenciaRacaCor] = useState(FILTRO_COMPETENCIA_VALOR_PADRAO);
  const [filtroEstabelecimentoUsuariosAtivos, setFiltroEstabelecimentoUsuariosAtivos] = useState(FILTRO_ESTABELECIMENTO_VALOR_PADRAO);
  const [filtroCompetenciaUsuariosAtivos, setFiltroCompetenciaUsuariosAtivos] = useState(FILTRO_COMPETENCIA_VALOR_PADRAO);
  const [filtroPeriodoPanorama, setFiltroPeriodoPanorama] = useState(FILTRO_COMPETENCIA_VALOR_PADRAO);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setPerfil(await getPerfilUsuarios(municipioIdSus));
      setPerfilPorEstabelecimento(
        await getPerfilUsuariosPorEstabelecimento(municipioIdSus)
      );
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const agregarPorEstabelecimentoPeriodoECondicao = (perfil) => {
    const perfilAgregado = [];

    perfil.forEach((dado) => {
      const { estabelecimento, competencia, periodo, ativos_mes: usuariosAtivos, usuario_condicao_saude: condicaoSaude } = dado;
      const perfilEncontrado = perfilAgregado
        .find((item) => item.estabelecimento === estabelecimento && item.periodo === periodo);

      if (!perfilEncontrado) {
        perfilAgregado.push({
          periodo,
          competencia,
          estabelecimento,
          ativosPorCondicao: [{ condicaoSaude, usuariosAtivos }]
        });
      } else {
        const condicaoEncontrada = perfilEncontrado.ativosPorCondicao
          .find((item) => item.condicaoSaude === condicaoSaude);

        condicaoEncontrada
          ? condicaoEncontrada.usuariosAtivos += usuariosAtivos
          : perfilEncontrado.ativosPorCondicao.push({ condicaoSaude, usuariosAtivos });
      }
    });

    return perfilAgregado;
  };

  const agregarPorEstabelecimentoPeriodoFaixaEtariaEGenero = (perfil) => {
    const perfilAgregado = [];

    perfil.forEach((dado) => {
      const {
        estabelecimento,
        competencia,
        periodo,
        ativos_mes: usuariosAtivos,
        usuario_faixa_etaria: faixaEtaria,
        usuario_sexo: usuarioSexo
      } = dado;
      const genero = usuarioSexo.toLowerCase();
      const perfilEncontrado = perfilAgregado
        .find((item) => item.estabelecimento === estabelecimento && item.periodo === periodo);

      if (!perfilEncontrado) {
        perfilAgregado.push({
          periodo,
          competencia,
          estabelecimento,
          ativosPorFaixaEtariaEGenero: [{ faixaEtaria, [genero]: usuariosAtivos }]
        });
      } else {
        const ativos = perfilEncontrado.ativosPorFaixaEtariaEGenero
          .find((item) => item.faixaEtaria === faixaEtaria);

        if (!ativos) {
          perfilEncontrado.ativosPorFaixaEtariaEGenero.push({ faixaEtaria, [genero]: usuariosAtivos });
        } else {
          ativos[genero]
            ? ativos[genero] += usuariosAtivos
            : ativos[genero] = usuariosAtivos;
        }
      }
    });

    return perfilAgregado;
  };

  const agregarPorEstabelecimentoPeriodoERacaCor = (perfil) => {
    const perfilAgregado = [];

    perfil.forEach((dado) => {
      const {
        estabelecimento,
        competencia,
        periodo,
        ativos_mes: usuariosAtivos,
        usuario_raca_cor: racaCor
      } = dado;
      const perfilEncontrado = perfilAgregado
        .find((item) => item.estabelecimento === estabelecimento && item.periodo === periodo);

      if (!perfilEncontrado) {
        perfilAgregado.push({
          periodo,
          competencia,
          estabelecimento,
          ativosPorRacaCor: [{ racaCor, usuariosAtivos }]
        });
      } else {
        const racaCorEncontrada = perfilEncontrado.ativosPorRacaCor
          .find((item) => item.racaCor === racaCor);

        racaCorEncontrada
          ? racaCorEncontrada.usuariosAtivos += usuariosAtivos
          : perfilEncontrado.ativosPorRacaCor.push({ racaCor, usuariosAtivos });
      }
    });

    return perfilAgregado;
  };

  const agregarPorEstabelecimentoPeriodoSituacaoESubstancias = (perfil) => {
    const perfilAgregado = [];

    perfil.forEach((dado) => {
      const {
        estabelecimento,
        competencia,
        periodo,
        ativos_mes: usuariosAtivos,
        usuario_situacao_rua: situacaoRua,
        usuario_abuso_substancias: abusoSubstancias
      } = dado;
      const perfilEncontrado = perfilAgregado
        .find((item) => item.estabelecimento === estabelecimento && item.periodo === periodo);

      if (!perfilEncontrado) {
        perfilAgregado.push({
          periodo,
          competencia,
          estabelecimento,
          ativosPorSituacaoDeRua: [{ situacaoRua, usuariosAtivos }],
          ativosPorAbusoSubstancias: [{ abusoSubstancias, usuariosAtivos }]
        });
      } else {
        const situacaoDeRuaEncontrada = perfilEncontrado.ativosPorSituacaoDeRua
          .find((item) => item.situacaoRua === situacaoRua);

        const abusoSubtanciasEncontrado = perfilEncontrado.ativosPorAbusoSubstancias
          .find((item) => item.abusoSubstancias === abusoSubstancias);

        situacaoDeRuaEncontrada
          ? situacaoDeRuaEncontrada.usuariosAtivos += usuariosAtivos
          : perfilEncontrado.ativosPorSituacaoDeRua.push({ situacaoRua, usuariosAtivos });

        abusoSubtanciasEncontrado
          ? abusoSubtanciasEncontrado.usuariosAtivos += usuariosAtivos
          : perfilEncontrado.ativosPorAbusoSubstancias.push({ abusoSubstancias, usuariosAtivos });
      }
    });

    return perfilAgregado;
  };

  const getPropsFiltroEstabelecimento = (perfil, estadoFiltro, funcaoSetFiltro) => {
    const optionsSemDuplicadas = [];

    perfil.forEach(({ estabelecimento }) => {
      const perfilEncontrado = optionsSemDuplicadas
        .find((item) => item.value === estabelecimento);

      if (!perfilEncontrado) {
        optionsSemDuplicadas.push({ value: estabelecimento, label: estabelecimento });
      }
    });

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Estabelecimento: { children }
      </components.Control>
    );

    return {
      options: optionsSemDuplicadas,
      defaultValue: estadoFiltro,
      selectedValue: estadoFiltro,
      onChange: (selected) => funcaoSetFiltro({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      isSearchable: false,
      components: { Control: optionPersonalizada },
      styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
    };
  };

  const getPropsFiltroCompetencia = (perfil, estadoFiltro, funcaoSetFiltro, estadoFiltroEstabelecimento) => {
    const options = perfil
      .filter(({ estabelecimento }) => estabelecimento === estadoFiltroEstabelecimento.value)
      .sort((a, b) => new Date(b.competencia) - new Date(a.competencia))
      .map(({ periodo }) => ({
        value: periodo,
        label: periodo
      }));

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Competência: { children }
      </components.Control>
    );

    return {
      options,
      defaultValue: estadoFiltro,
      selectedValue: estadoFiltro,
      onChange: (selected) => funcaoSetFiltro({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      isSearchable: false,
      components: { Control: optionPersonalizada },
      styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
    };
  };

  const getOpcoesGraficoCID = (perfil) => {
    const perfilFiltrado = perfil
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimentoCID.value
        && item.periodo === filtroCompetenciaCID.value
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
      );
    const [perfilAgregado] = agregarPorEstabelecimentoPeriodoECondicao(perfilFiltrado);

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
          data: perfilAgregado.ativosPorCondicao.map(({ condicaoSaude, usuariosAtivos }, index) => ({
            value: usuariosAtivos,
            name: !condicaoSaude ? "Sem informação" : condicaoSaude,
            itemStyle: {
              color: CORES_GRAFICO_DONUT[index]
            },
          }))
        }
      ]
    };
  };

  const getOpcoesGraficoGeneroEFaixaEtaria = (perfil) => {
    const NOME_DIMENSAO = "genero";
    const LABELS_DIMENSAO = ["Masculino", "Feminino"];

    const perfilFiltrado = perfil
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimentoGenero.value
        && item.periodo === filtroCompetenciaGenero.value
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
      );
    const [perfilAgregado] = agregarPorEstabelecimentoPeriodoFaixaEtariaEGenero(perfilFiltrado);

    return {
      legend: {
        itemGap: 25,
      },
      tooltip: {},
      dataset: {
        dimensions: [NOME_DIMENSAO, ...LABELS_DIMENSAO],
        source: perfilAgregado.ativosPorFaixaEtariaEGenero
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
        name: "Usuários ativos",
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

  const getOpcoesGraficoRacaEcor = (perfil) => {
    const NOME_DIMENSAO = "usuariosAtivos";
    const LABEL_DIMENSAO = "Usuários ativos";

    const perfilFiltrado = perfil
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimentoRacaCor.value
        && item.periodo === filtroCompetenciaRacaCor.value
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
      );
    const [perfilAgregado] = agregarPorEstabelecimentoPeriodoERacaCor(perfilFiltrado);

    return {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: [NOME_DIMENSAO, LABEL_DIMENSAO],
        source: perfilAgregado.ativosPorRacaCor
          .sort((a, b) => b.racaCor.localeCompare(a.racaCor))
          .map((item) => ({
            [NOME_DIMENSAO]: item.racaCor,
            [LABEL_DIMENSAO]: item.usuariosAtivos,
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

  const getOpcoesGraficoUsuariosAtivos = (perfil, titulo, tipo) => {
    const PROPIEDADES_POR_TIPO = {
      SITUACAO_RUA: {
        prop_agregacao: "ativosPorSituacaoDeRua",
        prop_nome: "situacaoRua"
      },
      ABUSO_SUBSTANCIAS: {
        prop_agregacao: "ativosPorAbusoSubstancias",
        prop_nome: "abusoSubstancias"
      }
    };

    const perfilFiltrado = perfil
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimentoUsuariosAtivos.value
        && item.periodo === filtroCompetenciaUsuariosAtivos.value
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
      );
    const [perfilAgregado] = agregarPorEstabelecimentoPeriodoSituacaoESubstancias(perfilFiltrado);

    const dadosUsuariosAtivos = perfilAgregado[PROPIEDADES_POR_TIPO[tipo].prop_agregacao];

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
          data: dadosUsuariosAtivos.map((item, index) => ({
            value: item.usuariosAtivos,
            name: item[PROPIEDADES_POR_TIPO[tipo].prop_nome],
            itemStyle: {
              color: CORES_GRAFICO_SUBST_MORADIA[index]
            },
          }))
        }
      ]
    };
  };

  const filtrarDadosGeraisPorPeriodo = (dados, filtroPeriodo) => {
    return dados.find((item) =>
      item.estabelecimento === "Todos"
      && item.estabelecimento_linha_perfil === "Todos"
      && item.estabelecimento_linha_idade === "Todos"
      && item.periodo === filtroPeriodo
    );
  };

  const getCardsPanoramaGeral = (perfilDeEstabelecimentos, filtroPeriodo) => {
    const perfilTodosEstabelecimentos = filtrarDadosGeraisPorPeriodo(
      perfilDeEstabelecimentos,
      filtroPeriodo
    );

    const {
      ativos_mes: ativosMes,
      dif_ativos_mes_anterior: difAtivosMesAnterior,
      ativos_3meses: ativos3Meses,
      dif_ativos_3meses_anterior: difAtivos3MesesAnterior,
      tornandose_inativos: tornandoInativos,
      dif_tornandose_inativos_anterior: difTornandoInativosAnterior
    } = perfilTodosEstabelecimentos;

    return (
      <Grid12Col
        proporcao="4-4-4"
        items={ [
          <>
            {
              <CardInfoTipoA
                fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                indicador={ ativos3Meses }
                indice={ difAtivos3MesesAnterior }
                indiceDescricao="últ. mês"
                titulo="Usuários ativos"
                tooltip="Usuários que tiveram algum procedimento registrado em BPA-i ou RAAS (exceto acolhimento inicial) nos três meses anteriores ao mês de referência"
              />
            }
          </>,
          <>
            {
              <CardInfoTipoA
                fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                indicador={ ativosMes }
                indice={ difAtivosMesAnterior }
                indiceDescricao="últ. mês"
                titulo="Frequentaram no mês"
                tooltip="Usuários que tiveram algum procedimento registrado em BPA-i ou RAAS (exceto acolhimento inicial) durante o mês de referÊncia"
              />
            }
          </>,
          <>
            {
              <CardInfoTipoA
                fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                indicador={ tornandoInativos }
                indice={ difTornandoInativosAnterior }
                indiceDescricao="últ. mês"
                titulo="Tornaram-se inativos"
                tooltip="Usuários que, no mês de referência, completaram três meses sem ter procedimentos registrados em BPA-i ou RAAS (exceto acolhimento inicial)"
              />
            }
          </>,
        ] }
      />
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
        titulo="<strong>Perfil do usuário</strong>"
      />

      <GraficoInfo
        titulo="Perfil dos usuários ativos"
        descricao="Quantitativo de usuários com RAAS ou BPA movimentada nos últimos meses (exceto acolhimento inicial)."
        tooltip="Usuários ativos: Usuários que tiveram algum procedimento registrado em BPA-i ou RAAS (exceto acolhimento inicial) nos três meses anteriores ao mês de referência.
        Usuários inativos: Usuários que não tiveram nenhum procedimento registrado no serviço há mais de 3 meses."
      />

      { perfilPorEstabelecimento.length !== 0 &&
        <GraficoInfo
          descricao={ `Última competência disponível: ${filtrarDadosGeraisPorPeriodo(perfilPorEstabelecimento, "Último período").nome_mes
            }` }
        />
      }

      <GraficoInfo
        titulo="Panorama geral"
      />

      { perfilPorEstabelecimento.length !== 0 &&
        <div className={ styles.Filtro }>
          <Select { ...getPropsFiltroPeriodo(
            perfilPorEstabelecimento,
            filtroPeriodoPanorama,
            setFiltroPeriodoPanorama,
            false
          ) } />
        </div>
      }

      { perfilPorEstabelecimento.length !== 0 &&
        getCardsPanoramaGeral(
          perfilPorEstabelecimento,
          filtroPeriodoPanorama.value
        )
      }

      {/* <GraficoInfo
        titulo="Detalhamento por estabelecimento"
      /> */}

      <GraficoInfo
        titulo="CID dos usuários ativos"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfil.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select
                { ...getPropsFiltroEstabelecimento(
                  agregarPorEstabelecimentoPeriodoECondicao(perfil),
                  filtroEstabelecimentoCID,
                  setFiltroEstabelecimentoCID
                )
                }
              />
            </div>
            <div className={ styles.Filtro }>
              <Select
                { ...getPropsFiltroCompetencia(
                  agregarPorEstabelecimentoPeriodoECondicao(perfil),
                  filtroCompetenciaCID,
                  setFiltroCompetenciaCID,
                  filtroEstabelecimentoCID
                )
                }
              />
            </div>
          </div>

          <div className={ styles.GraficoCIDContainer }>
            <ReactEcharts
              option={ getOpcoesGraficoCID(perfil) }
              style={ { width: "40%", height: "100%" } }
            />
          </div>
        </>
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfil.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select
                { ...getPropsFiltroEstabelecimento(
                  agregarPorEstabelecimentoPeriodoFaixaEtariaEGenero(perfil),
                  filtroEstabelecimentoGenero,
                  setFiltroEstabelecimentoGenero
                )
                }
              />
            </div>
            <div className={ styles.Filtro }>
              <Select
                { ...getPropsFiltroCompetencia(
                  agregarPorEstabelecimentoPeriodoFaixaEtariaEGenero(perfil),
                  filtroCompetenciaGenero,
                  setFiltroCompetenciaGenero,
                  filtroEstabelecimentoGenero
                )
                }
              />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoGeneroEFaixaEtaria(perfil) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Usuários ativos"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfil.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select
                { ...getPropsFiltroEstabelecimento(
                  agregarPorEstabelecimentoPeriodoSituacaoESubstancias(perfil),
                  filtroEstabelecimentoUsuariosAtivos,
                  setFiltroEstabelecimentoUsuariosAtivos
                )
                }
              />
            </div>
            <div className={ styles.Filtro }>
              <Select
                { ...getPropsFiltroCompetencia(
                  agregarPorEstabelecimentoPeriodoSituacaoESubstancias(perfil),
                  filtroCompetenciaUsuariosAtivos,
                  setFiltroCompetenciaUsuariosAtivos,
                  filtroEstabelecimentoUsuariosAtivos
                )
                }
              />
            </div>
          </div>

          <div className={ styles.GraficosUsuariosAtivosContainer }>
            <div className={ styles.GraficoUsuariosAtivos }>
              <ReactEcharts
                option={ getOpcoesGraficoUsuariosAtivos(
                  perfil,
                  "Fazem uso de substâncias psicoativas?",
                  "ABUSO_SUBSTANCIAS"
                ) }
                style={ { width: "100%", height: "100%" } }
              />
            </div>

            <div className={ styles.GraficoUsuariosAtivos }>
              <ReactEcharts
                option={ getOpcoesGraficoUsuariosAtivos(
                  perfil,
                  "Estão em situação de rua?",
                  "SITUACAO_RUA"
                ) }
                style={ { width: "100%", height: "100%" } }
              />
            </div>
          </div>
        </>
      }

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfil.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select
                { ...getPropsFiltroEstabelecimento(
                  agregarPorEstabelecimentoPeriodoERacaCor(perfil),
                  filtroEstabelecimentoRacaCor,
                  setFiltroEstabelecimentoRacaCor
                )
                }
              />
            </div>
            <div className={ styles.Filtro }>
              <Select
                { ...getPropsFiltroCompetencia(
                  agregarPorEstabelecimentoPeriodoERacaCor(perfil),
                  filtroCompetenciaRacaCor,
                  setFiltroCompetenciaRacaCor,
                  filtroEstabelecimentoRacaCor
                )
                }
              />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoRacaEcor(perfil) }
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

export default PerfilUsuario;
