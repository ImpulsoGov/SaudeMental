import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { agregarPorAbusoSubstancias, agregarPorSituacaoRua, getOpcoesGraficoAbusoESituacao } from "../../../helpers/graficoAbusoESituacao";
import { agregarPorCondicaoSaude, getOpcoesGraficoCID } from "../../../helpers/graficoCID";
import { agregarPorFaixaEtariaEGenero, getOpcoesGraficoGeneroEFaixaEtaria } from "../../../helpers/graficoGeneroEFaixaEtaria";
import { getOpcoesGraficoHistoricoTemporal } from "../../../helpers/graficoHistoricoTemporal";
import { agregarPorRacaCor, getOpcoesGraficoRacaEcor } from "../../../helpers/graficoRacaECor";
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

  const filtrarPorEstabelecimento = (dados, filtroEstabelecimento) => {
    return dados
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento.value
        // && item.estabelecimento_linha_perfil === "Todos"
        // && item.estabelecimento_linha_idade === "Todos"
      );
  };

  const filtrarDadosGeraisPorPeriodoEstabelecimento = (dados, filtroEstabelecimento, filtroPeriodo) => {
    const periodosSelecionados = filtroPeriodo.map(({ value }) => value);

    return dados.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && periodosSelecionados.includes(item.periodo)
      && item.estabelecimento_linha_perfil === "Todos"
      && item.estabelecimento_linha_idade === "Todos"
    );
  };

  const agregadosPorCondicaoSaude = agregarPorCondicaoSaude(
    filtrarDadosGeraisPorPeriodoEstabelecimento(novosUsuarios, filtroEstabelecimentoPerfil, filtroPeriodoPerfil),
    "usuario_condicao_saude",
    "usuarios_novos"
  );

  const agregadosPorGeneroEFaixaEtaria = agregarPorFaixaEtariaEGenero(
    filtrarDadosGeraisPorPeriodoEstabelecimento(novosUsuarios, filtroEstabelecimentoGenero, filtroPeriodoGenero),
    "usuario_faixa_etaria",
    "usuario_sexo",
    "usuarios_novos"
  );

  const agregadosPorAbusoSubstancias = agregarPorAbusoSubstancias(
    filtrarDadosGeraisPorPeriodoEstabelecimento(novosUsuarios, filtroEstabelecimentoSubstEMoradia, filtroPeriodoSubstEMoradia),
    "usuario_abuso_substancias",
    "usuarios_novos"
  );

  const agregadosPorSituacaoRua = agregarPorSituacaoRua(
    filtrarDadosGeraisPorPeriodoEstabelecimento(novosUsuarios, filtroEstabelecimentoSubstEMoradia, filtroPeriodoSubstEMoradia),
    "usuario_situacao_rua",
    "usuarios_novos"
  );

  const agregadosPorRacaCor = agregarPorRacaCor(
    filtrarDadosGeraisPorPeriodoEstabelecimento(novosUsuarios, filtroEstabelecimentoRacaECor, filtroPeriodoRacaECor),
    "usuario_raca_cor",
    "usuarios_novos"
  );

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
              filtrarPorEstabelecimento(resumoNovosUsuarios, filtroEstabelecimentoHistorico),
              "usuarios_novos",
              "Usuários novos:"
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
            option={ getOpcoesGraficoCID(agregadosPorCondicaoSaude) }
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
              agregadosPorGeneroEFaixaEtaria,
              "Usuários novos"
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
                  agregadosPorAbusoSubstancias,
                  "Fazem uso de substâncias psicoativas?",
                  "ABUSO_SUBSTANCIAS",
                ) }
                style={ { width: "100%", height: "100%" } }
              />
            </div>

            <div className={ styles.GraficoUsuariosAtivos }>
              <ReactEcharts
                option={ getOpcoesGraficoAbusoESituacao(
                  agregadosPorSituacaoRua,
                  "Estão em situação de rua?",
                  "SITUACAO_RUA",
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
              agregadosPorRacaCor,
              "Usuários novos no período"
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
