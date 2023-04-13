import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
// import novosResumo from "./novosResumo.json";
import ReactEcharts from "echarts-for-react";
import Select from "react-select";
import { getPropsFiltroEstabelecimento } from "../../../helpers/filtrosGraficos";
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
          name: "Taxa de abandono mensal (%):",
          data: quantidadesUsuariosNovos,
          type: 'line',
          itemStyle: {
            color: "#5367C9"
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
        titulo="Total de atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos por horas trabalhadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />
    </div>
  );
};

export default NovoUsuario;
