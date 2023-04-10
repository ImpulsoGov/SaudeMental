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
      const { estabelecimento, competencia, periodo, ativos_mes: quantidadeAtivos, usuario_condicao_saude: condicaoSaude } = dado;
      const perfilEncontrado = perfilAgregado
        .find((item) => item.estabelecimento === estabelecimento && item.periodo === periodo);

      if (!perfilEncontrado) {
        perfilAgregado.push({
          periodo,
          competencia,
          estabelecimento,
          ativosPorCondicao: [{ condicaoSaude, quantidadeAtivos }]
        });
      } else {
        const condicaoEncontrada = perfilEncontrado.ativosPorCondicao
          .find((item) => item.condicaoSaude === condicaoSaude);

        if (!condicaoEncontrada) {
          perfilEncontrado.ativosPorCondicao.push({ condicaoSaude, quantidadeAtivos });
        } else {
          condicaoEncontrada.quantidadeAtivos += quantidadeAtivos;
        }
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
        ativos_mes: quantidadeAtivos,
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
          ativosPorFaixaEtariaEGenero: [{ faixaEtaria, [genero]: quantidadeAtivos }]
        });
      } else {
        const ativos = perfilEncontrado.ativosPorFaixaEtariaEGenero
          .find((item) => item.faixaEtaria === faixaEtaria);

        if (!ativos) {
          perfilEncontrado.ativosPorFaixaEtariaEGenero.push({ faixaEtaria, [genero]: quantidadeAtivos });
        } else {
          !ativos[genero]
            ? ativos[genero] = quantidadeAtivos
            : ativos[genero] += quantidadeAtivos;
        }
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

  const getOpcoesGraficoDonut = (perfil) => {
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
          data: ativosPorCondicao.map(({ condicaoSaude, quantidadeAtivos }, index) => ({
            value: quantidadeAtivos,
            name: !condicaoSaude ? "Sem informação" : condicaoSaude,
            itemStyle: {
              color: CORES_GRAFICO_DONUT[index]
            },
          }))
        }
      ]
    };
  };

  const getOpcoesGraficoBarrasDuplas = (perfil) => {
    const NOME_DIMENSAO = "genero";
    const VALORES_DIMENSAO = ["Masculino", "Feminino"];

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
        dimensions: [NOME_DIMENSAO, ...VALORES_DIMENSAO],
        source: ativosPorFaixaEtariaEGenero
          .sort((a, b) => a.faixaEtaria.localeCompare(b.faixaEtaria))
          .map((item) => ({
            [NOME_DIMENSAO]: item.faixaEtaria,
            [VALORES_DIMENSAO[0]]: item[VALORES_DIMENSAO[0].toLowerCase()],
            [VALORES_DIMENSAO[1]]: item[VALORES_DIMENSAO[1].toLowerCase()],
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
            formatter: `{@${VALORES_DIMENSAO[0]}}`,
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
            formatter: `{@${VALORES_DIMENSAO[1]}}`,
            color: "#FFFFFF",
          },
        }
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
              option={ getOpcoesGraficoDonut(perfil) }
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
            option={ getOpcoesGraficoBarrasDuplas(perfil) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Atendimentos por horas trabalhadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />
    </div>
  );
};

export default PerfilUsuario;
