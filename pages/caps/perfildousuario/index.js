import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
// import { getPerfilUsuariosPorEstabelecimento, getPerfilUsuarios } from "../../../requests/caps";
import ReactEcharts from "echarts-for-react";
import Select, { components } from "react-select";
import styles from "../Caps.module.css";
import usuariosAtivos from "./usuariosAtivos.json";

const CORES_GRAFICO_DONUT = ["#5367C9", "#6577CF", "#7685D4", "#8795DA", "#98A4DF", "#A9B3E4", "#BAC2E9", "#CAD0EE", "#D3D8F1", "#E0E4F5", "#8795DA", "#8795DA", "#8795DA"];

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const PerfilUsuario = () => {
  const { data: session } = useSession();
  const [perfil, setPerfil] = useState(usuariosAtivos);
  // const [perfilPorEstabelecimento, setPerfilPorEstabelecimento] = useState(usuariosPorEstabelecimento);
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroCompetenciaCID, setFiltroCompetenciaCID] = useState({
    value: "", label: ""
  });
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroCompetenciaGenero, setFiltroCompetenciaGenero] = useState({
    value: "", label: ""
  });
  const [filtroEstabelecimentoRacaCor, setFiltroEstabelecimentoRacaCor] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroCompetenciaRacaCor, setFiltroCompetenciaRacaCor] = useState({
    value: "", label: ""
  });

  // useEffect(() => {
  //   const getDados = async (municipioIdSus) => {
  //     setPerfil(await getPerfilUsuarios(520880));
  //     setPerfilPorEstabelecimento(
  //       await getPerfilUsuariosPorEstabelecimento(municipioIdSus)
  //     );
  //   };

  //   if (session?.user.municipio_id_ibge) {
  //     getDados(session?.user.municipio_id_ibge);
  //   }
  // }, []);

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
    const perfilAgregado = agregarPorEstabelecimentoPeriodoECondicao(perfil);
    const perfilFiltrado = perfilAgregado
      .filter(({ estabelecimento, periodo }) =>
        estabelecimento === filtroEstabelecimentoCID.value
        // && periodo === filtroCompetencia.value
      );

    const { ativosPorCondicao } = perfilFiltrado.find(({ periodo }) => {
      return filtroCompetenciaCID.value === ""
        ? true
        : filtroCompetenciaCID.value === periodo;
    });

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
          data: ativosPorCondicao.map(({ condicaoSaude, usuariosAtivos }, index) => ({
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

    const perfilAgregado = agregarPorEstabelecimentoPeriodoFaixaEtariaEGenero(perfil);
    const perfilFiltrado = perfilAgregado
      .filter(({ estabelecimento, periodo }) => estabelecimento === filtroEstabelecimentoGenero.value
        // && periodo === filtroCompetencia.value
      );

    const { ativosPorFaixaEtariaEGenero } = perfilFiltrado.find(({ periodo }) => {
      return filtroCompetenciaGenero.value === ""
        ? true
        : filtroCompetenciaGenero.value === periodo;
    });

    return {
      legend: {
        itemGap: 25,
      },
      tooltip: {},
      dataset: {
        dimensions: [NOME_DIMENSAO, ...LABELS_DIMENSAO],
        source: ativosPorFaixaEtariaEGenero
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

    const perfilAgregado = agregarPorEstabelecimentoPeriodoERacaCor(perfil);
    const perfilFiltrado = perfilAgregado
      .filter(({ estabelecimento, periodo }) => estabelecimento === filtroEstabelecimentoRacaCor.value
        // && periodo === filtroCompetencia.value
      );

    const { ativosPorRacaCor } = perfilFiltrado.find(({ periodo }) => {
      return filtroCompetenciaRacaCor.value === ""
        ? true
        : filtroCompetenciaRacaCor.value === periodo;
    });

    return {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: [NOME_DIMENSAO, LABEL_DIMENSAO],
        source: ativosPorRacaCor
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
        tooltip="a"
      />

      <GraficoInfo
        titulo="Panorama geral"
      />

      <Grid12Col
        proporcao="4-4-4"
        items={ [
          <>
            {
              <CardInfoTipoA
                fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                indicador={ 692 }
                indice={ -141 }
                indiceDescricao="últ. mês"
                link={ {
                  label: 'Mais Informações',
                  url: '/'
                } }
                titulo="Usuários que frequentaram"
                tooltip="Dados de usuários ativos"
              />
            }
          </>,
          <>
            {
              <CardInfoTipoA
                fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                indicador={ 692 }
                indice={ -141 }
                indiceDescricao="últ. mês"
                link={ {
                  label: 'Mais Informações',
                  url: '/'
                } }
                titulo="Usuários que frequentaram"
                tooltip="Dados de usuários ativos"
              />
            }
          </>,
          <>
            {
              <CardInfoTipoA
                fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                indicador={ 692 }
                indice={ -141 }
                indiceDescricao="últ. mês"
                link={ {
                  label: 'Mais Informações',
                  url: '/'
                } }
                titulo="Usuários que frequentaram"
                tooltip="Dados de usuários ativos"
              />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Detalhamento por estabelecimento"
      />

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

          <div className={ styles.GraficoDonutContainer }>
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
