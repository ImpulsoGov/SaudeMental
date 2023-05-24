import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { CORES_GRAFICO_DONUT } from "../../../constants/CORES_GRAFICO_DONUT";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import styles from "../Caps.module.css";

import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { agregarPorAbusoSubstancias, agregarPorSituacaoRua, getOpcoesGraficoAbusoESituacao } from "../../../helpers/graficoAbusoESituacao";
import { agregarPorFaixaEtariaEGenero, getOpcoesGraficoGeneroEFaixaEtaria } from "../../../helpers/graficoGeneroEFaixaEtaria";
import { agregarPorRacaCor, getOpcoesGraficoRacaEcor } from "../../../helpers/graficoRacaECor";
import { getPerfilUsuarios, getPerfilUsuariosPorEstabelecimento, getUsuariosAtivosPorCondicao, getUsuariosAtivosPorGeneroEIdade, getUsuariosAtivosPorRacaECor } from "../../../requests/caps";

const FILTRO_COMPETENCIA_VALOR_PADRAO = { value: "Último período", label: "Último período" };
const FILTRO_ESTABELECIMENTO_VALOR_PADRAO = { value: "Todos", label: "Todos" };
const LINHA_PERFIL = "Todos";
const LINHA_IDADE = "Todos";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const PerfilUsuario = () => {
  const { data: session } = useSession();
  const [perfil, setPerfil] = useState([]);
  const [usuariosPorCondicao, setUsuariosPorCondicao] = useState([]);
  const [usuariosPorGeneroEIdade, setUsuariosPorGeneroEIdade] = useState([]);
  const [usuariosPorRacaECor, setUsuariosPorRacaECor] = useState([]);
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
      setUsuariosPorCondicao(await getUsuariosAtivosPorCondicao(
        municipioIdSus, LINHA_PERFIL, LINHA_IDADE
      ));
      setUsuariosPorGeneroEIdade(await getUsuariosAtivosPorGeneroEIdade(
        municipioIdSus, LINHA_PERFIL, LINHA_IDADE
      ));
      setUsuariosPorRacaECor(await getUsuariosAtivosPorRacaECor(
        municipioIdSus, LINHA_PERFIL, LINHA_IDADE
      ));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const agregarPorEstabelecimentoPeriodoECondicao = (perfil) => {
    const perfilAgregado = [];

    perfil.forEach((dado) => {
      const { estabelecimento, competencia, periodo, ativos_3meses: usuariosAtivos, usuario_condicao_saude: condicaoSaude } = dado;
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

  const filtrarPorPeriodoEEstabelecimento = (dados, filtroEstabelecimento, filtroPeriodo) => {
    return dados.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && item.periodo === filtroPeriodo.value
    );
  };

  const agregadosPorAbusoSubstancias = useMemo(() => {
    return agregarPorAbusoSubstancias(
      filtrarPorPeriodoEEstabelecimento(usuariosPorCondicao, filtroEstabelecimentoUsuariosAtivos, filtroCompetenciaUsuariosAtivos),
      "usuario_abuso_substancias",
      "ativos_3meses"
    );
  }, [usuariosPorCondicao, filtroEstabelecimentoUsuariosAtivos, filtroCompetenciaUsuariosAtivos]);

  const agregadosPorSituacaoRua = useMemo(() => {
    return agregarPorSituacaoRua(
      filtrarPorPeriodoEEstabelecimento(usuariosPorCondicao, filtroEstabelecimentoUsuariosAtivos, filtroCompetenciaUsuariosAtivos),
      "usuario_situacao_rua",
      "ativos_3meses"
    );
  }, [usuariosPorCondicao, filtroEstabelecimentoUsuariosAtivos, filtroCompetenciaUsuariosAtivos]);

  const agregadosPorGeneroEFaixaEtaria = useMemo(() => {
    return agregarPorFaixaEtariaEGenero(
      filtrarPorPeriodoEEstabelecimento(usuariosPorGeneroEIdade, filtroEstabelecimentoGenero, filtroCompetenciaGenero),
      "usuario_faixa_etaria",
      "usuario_sexo",
      "ativos_3meses"
    );
  }, [usuariosPorGeneroEIdade, filtroEstabelecimentoGenero, filtroCompetenciaGenero]);

  const agregadosPorRacaCor = useMemo(() => {
    return agregarPorRacaCor(
      filtrarPorPeriodoEEstabelecimento(usuariosPorRacaECor, filtroEstabelecimentoRacaCor, filtroCompetenciaRacaCor),
      "usuario_raca_cor",
      "ativos_3meses"
    );
  }, [usuariosPorRacaECor, filtroEstabelecimentoRacaCor, filtroCompetenciaRacaCor]);

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

      { perfilPorEstabelecimento.length !== 0
        ? <GraficoInfo
          descricao={ `Última competência disponível: ${filtrarDadosGeraisPorPeriodo(perfilPorEstabelecimento, "Último período").nome_mes
            }` }
        />
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Panorama geral"
      />

      { perfilPorEstabelecimento.length !== 0
        ? (
          <>
            <div className={ styles.Filtro }>
              <Select { ...getPropsFiltroPeriodo(
                perfilPorEstabelecimento,
                filtroPeriodoPanorama,
                setFiltroPeriodoPanorama,
                false
              ) } />
            </div>

            {
              getCardsPanoramaGeral(
                perfilPorEstabelecimento,
                filtroPeriodoPanorama.value
              )
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      {/* <GraficoInfo
        titulo="Detalhamento por estabelecimento"
      /> */}

      <GraficoInfo
        titulo="CID dos usuários ativos"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfil.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroEstabelecimento(
                    perfil,
                    filtroEstabelecimentoCID,
                    setFiltroEstabelecimentoCID
                  )
                  }
                />
              </div>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroPeriodo(
                    perfil,
                    filtroCompetenciaCID,
                    setFiltroCompetenciaCID,
                    false
                  )
                  }
                />
              </div>
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoCID(perfil) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { usuariosPorGeneroEIdade.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroEstabelecimento(
                    usuariosPorGeneroEIdade,
                    filtroEstabelecimentoGenero,
                    setFiltroEstabelecimentoGenero
                  )
                  }
                />
              </div>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroPeriodo(
                    usuariosPorGeneroEIdade,
                    filtroCompetenciaGenero,
                    setFiltroCompetenciaGenero,
                    false
                  )
                  }
                />
              </div>
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoGeneroEFaixaEtaria(
                agregadosPorGeneroEFaixaEtaria,
                "Usuários ativos"
              ) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Usuários ativos"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { usuariosPorCondicao.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroEstabelecimento(
                    usuariosPorCondicao,
                    filtroEstabelecimentoUsuariosAtivos,
                    setFiltroEstabelecimentoUsuariosAtivos
                  )
                  }
                />
              </div>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroPeriodo(
                    usuariosPorCondicao,
                    filtroCompetenciaUsuariosAtivos,
                    setFiltroCompetenciaUsuariosAtivos,
                    false
                  )
                  }
                />
              </div>
            </div>

            <div className={ styles.GraficosUsuariosAtivosContainer }>
              <div className={ styles.GraficoUsuariosAtivos }>
                <ReactEcharts
                  option={ getOpcoesGraficoAbusoESituacao(
                    agregadosPorAbusoSubstancias,
                    "Fazem uso de substâncias psicoativas?",
                    "ABUSO_SUBSTANCIAS"
                  ) }
                  style={ { width: "100%", height: "100%" } }
                />
              </div>

              <div className={ styles.GraficoUsuariosAtivos }>
                <ReactEcharts
                  option={ getOpcoesGraficoAbusoESituacao(
                    agregadosPorSituacaoRua,
                    "Estão em situação de rua?",
                    "SITUACAO_RUA"
                  ) }
                  style={ { width: "100%", height: "100%" } }
                />
              </div>
            </div>
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { usuariosPorRacaECor.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroEstabelecimento(
                    usuariosPorRacaECor,
                    filtroEstabelecimentoRacaCor,
                    setFiltroEstabelecimentoRacaCor
                  )
                  }
                />
              </div>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroPeriodo(
                    usuariosPorRacaECor,
                    filtroCompetenciaRacaCor,
                    setFiltroCompetenciaRacaCor,
                    false
                  )
                  }
                />
              </div>
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoRacaEcor(
                agregadosPorRacaCor,
                "Usuários ativos"
              ) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        descricao="*Dados podem ter problemas de coleta, registro e preenchimento"
      />
    </div>
  );
};

export default PerfilUsuario;
