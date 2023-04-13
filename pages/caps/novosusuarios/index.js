import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
// import novosResumo from "./novosResumo.json";
import ReactEcharts from "echarts-for-react";
import Select from "react-select";
import { CORES_GRAFICO_DONUT } from "../../../constants/CORES_GRAFICO_DONUT";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodoMulti } from "../../../helpers/filtrosGraficos";
import novosPerfilJSON from "../../dadosrecife/caps_usuarios_novos_perfil_recife.json";
import novosResumoJSON from "../../dadosrecife/caps_usuarios_novos_resumo_recife.json";
import styles from "../Caps.module.css";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const NovoUsuario = () => {
  const { data: session } = useSession();
  const [novosUsuarios, setNovosUsusarios] = useState([]);
  const [resumoNovosUsuarios, setResumoNovosUsuarios] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroPeriodoPerfil, setFiltroPeriodoPerfil] = useState([
    { value: "Último período", label: "Último período" },
    { value: "Jan/23", label: "Jan/23" },
  ]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      // if (municipioIdSus = '261160') {
      setNovosUsusarios(novosPerfilJSON);
      setResumoNovosUsuarios(novosResumoJSON);
      // }
      // setNovosUsusarios(await getNovosUsuarios(municipioIdSus));
      // setResumoNovosUsuarios(
      //   await getResumoNovosUsuarios(municipioIdSus)
      // );
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
      .filter(({ periodo, estabelecimento, estabelecimento_linha_perfil: linhaPerfil }) =>
        periodo === "Último período"
        && estabelecimento !== "Todos"
        && linhaPerfil !== "Todos"
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
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
      );

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

  const getOpcoesGraficoPerfil = (novosUsuarios) => {
    const periodosSelecionados = filtroPeriodoPerfil
      .map(({ value }) => value);

    const dadosUsuariosFiltrados = novosUsuarios
      .filter((item) =>
        item.estabelecimento === "Todos"
        && periodosSelecionados.includes(item.periodo)
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
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
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroPeriodoMulti(
                novosUsuarios,
                filtroPeriodoPerfil,
                setFiltroPeriodoPerfil
              )
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoPerfil(novosUsuarios) }
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

export default NovoUsuario;
