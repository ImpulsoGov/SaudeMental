import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import styles from "../Caps.module.css";

import TabelaDetalhamentoPorCaps from "../../../components/Tabelas/DetalhamentoPorCaps";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { agregarPorAbusoSubstancias, agregarPorSituacaoRua, getOpcoesGraficoAbusoESituacao } from "../../../helpers/graficoAbusoESituacao";
import { agregarPorCondicaoSaude, getOpcoesGraficoCID } from "../../../helpers/graficoCID";
import { agregarPorFaixaEtariaEGenero, getOpcoesGraficoGeneroEFaixaEtaria } from "../../../helpers/graficoGeneroEFaixaEtaria";
import { agregarPorRacaCor, getOpcoesGraficoRacaEcor } from "../../../helpers/graficoRacaECor";
import { getEstabelecimentosPerfil, getPerfilUsuariosPorEstabelecimento, getPeriodosPerfil, getUsuariosAtivosPorCID, getUsuariosAtivosPorCondicao, getUsuariosAtivosPorGeneroEIdade, getUsuariosAtivosPorRacaECor } from "../../../requests/caps";

const FILTRO_COMPETENCIA_VALOR_PADRAO = { value: "Último período", label: "Último período" };
const FILTRO_ESTABELECIMENTO_VALOR_PADRAO = { value: "Todos", label: "Todos" };

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const PerfilUsuario = () => {
  const { data: session } = useSession();
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [usuariosPorCondicao, setUsuariosPorCondicao] = useState([]);
  const [usuariosPorGeneroEIdade, setUsuariosPorGeneroEIdade] = useState([]);
  const [usuariosPorRacaECor, setUsuariosPorRacaECor] = useState([]);
  const [usuariosPorCID, setUsuariosPorCID] = useState([]);
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
  const [loadingCID, setLoadingCID] = useState(false);
  const [loadingGenero, setLoadingGenero] = useState(false);
  const [loadingCondicao, setLoadingCondicao] = useState(false);
  const [loadingRaca, setLoadingRaca] = useState(false);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      getPerfilUsuariosPorEstabelecimento(session?.user.municipio_id_ibge)
        .then((dados) => setPerfilPorEstabelecimento(dados));

      getEstabelecimentosPerfil(session?.user.municipio_id_ibge)
        .then((estabelecimentos) => setEstabelecimentos(estabelecimentos));

      getPeriodosPerfil(session?.user.municipio_id_ibge)
        .then((periodos) => setCompetencias(periodos));
    }
  }, []);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCID(true);

      getUsuariosAtivosPorCID(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoCID.value,
        filtroCompetenciaCID.value
      ).then((dadosFiltrados) => {
        setUsuariosPorCID(dadosFiltrados);
        setLoadingCID(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoCID.value, filtroCompetenciaCID.value]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCondicao(true);

      getUsuariosAtivosPorCondicao(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoUsuariosAtivos.value,
        filtroCompetenciaUsuariosAtivos.value
      ).then((dadosFiltrados) => {
        setUsuariosPorCondicao(dadosFiltrados);
        setLoadingCondicao(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoUsuariosAtivos.value, filtroCompetenciaUsuariosAtivos.value]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingGenero(true);

      getUsuariosAtivosPorGeneroEIdade(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoGenero.value,
        filtroCompetenciaGenero.value
      ).then((dadosFiltrados) => {
        setUsuariosPorGeneroEIdade(dadosFiltrados);
        setLoadingGenero(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoGenero.value, filtroCompetenciaGenero.value]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingRaca(true);

      getUsuariosAtivosPorRacaECor(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoRacaCor.value,
        filtroCompetenciaRacaCor.value
      ).then((dadosFiltrados) => {
        setUsuariosPorRacaECor(dadosFiltrados);
        setLoadingRaca(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoRacaCor.value, filtroCompetenciaRacaCor.value]);

  const encontrarDadosGeraisPorPeriodo = (dados, filtroPeriodo) => {
    return dados.find((item) =>
      item.estabelecimento === "Todos"
      && item.estabelecimento_linha_perfil === "Todos"
      && item.estabelecimento_linha_idade === "Todos"
      && item.periodo === filtroPeriodo
    );
  };

  const filtrarDadosEstabelecimentosPorPeriodo = (dados, filtroPeriodo) => {
    return dados.filter((item) =>
      item.estabelecimento_linha_perfil === "Todos"
      && item.estabelecimento_linha_idade === "Todos"
      && item.periodo === filtroPeriodo
      && item.estabelecimento !== "Todos"
    );
  };

  const getCardsPanoramaGeral = (perfilDeEstabelecimentos, filtroPeriodo) => {
    const perfilTodosEstabelecimentos = encontrarDadosGeraisPorPeriodo(
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

  const agregadosPorAbusoSubstancias = useMemo(() => {
    return agregarPorAbusoSubstancias(
      usuariosPorCondicao,
      "usuario_abuso_substancias",
      "ativos_3meses"
    );
  }, [usuariosPorCondicao]);

  const agregadosPorSituacaoRua = useMemo(() => {
    return agregarPorSituacaoRua(
      usuariosPorCondicao,
      "usuario_situacao_rua",
      "ativos_3meses"
    );
  }, [usuariosPorCondicao]);

  const agregadosPorGeneroEFaixaEtaria = useMemo(() => {
    return agregarPorFaixaEtariaEGenero(
      usuariosPorGeneroEIdade,
      "usuario_faixa_etaria",
      "usuario_sexo",
      "ativos_3meses"
    );
  }, [usuariosPorGeneroEIdade]);

  const agregadosPorRacaCor = useMemo(() => {
    return agregarPorRacaCor(
      usuariosPorRacaECor,
      "usuario_raca_cor",
      "ativos_3meses"
    );
  }, [usuariosPorRacaECor]);

  const agregadosPorCondicaoSaude = useMemo(() => {
    return agregarPorCondicaoSaude(
      usuariosPorCID,
      "usuario_condicao_saude",
      "ativos_3meses"
    );
  }, [usuariosPorCID]);

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
          descricao={ `Última competência disponível: ${encontrarDadosGeraisPorPeriodo(perfilPorEstabelecimento, "Último período").nome_mes
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

      <GraficoInfo
        titulo="Detalhamento por estabelecimento"
      />

      { perfilPorEstabelecimento.length !== 0
        ? <TabelaDetalhamentoPorCaps
          usuariosPorCaps={ filtrarDadosEstabelecimentosPorPeriodo(
            perfilPorEstabelecimento, filtroPeriodoPanorama.value
          ) }
        />
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="CID dos usuários ativos"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { usuariosPorCID.length !== 0
        && competencias.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroEstabelecimento(
                    estabelecimentos,
                    filtroEstabelecimentoCID,
                    setFiltroEstabelecimentoCID
                  )
                  }
                />
              </div>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroPeriodo(
                    competencias,
                    filtroCompetenciaCID,
                    setFiltroCompetenciaCID,
                    false
                  )
                  }
                />
              </div>
            </div>

            { loadingCID
              ? <Spinner theme="ColorSM" height="70vh" />
              : <ReactEcharts
                option={ getOpcoesGraficoCID(agregadosPorCondicaoSaude) }
                style={ { width: "100%", height: "70vh" } }
              />
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { usuariosPorGeneroEIdade.length !== 0
        && competencias.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroEstabelecimento(
                    estabelecimentos,
                    filtroEstabelecimentoGenero,
                    setFiltroEstabelecimentoGenero
                  )
                  }
                />
              </div>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroPeriodo(
                    competencias,
                    filtroCompetenciaGenero,
                    setFiltroCompetenciaGenero,
                    false
                  )
                  }
                />
              </div>
            </div>

            { loadingGenero
              ? <Spinner theme="ColorSM" height="70vh" />
              : <ReactEcharts
                option={ getOpcoesGraficoGeneroEFaixaEtaria(
                  agregadosPorGeneroEFaixaEtaria,
                  "Usuários ativos"
                ) }
                style={ { width: "100%", height: "70vh" } }
              />
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Usuários ativos"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { usuariosPorCondicao.length !== 0
        && competencias.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroEstabelecimento(
                    estabelecimentos,
                    filtroEstabelecimentoUsuariosAtivos,
                    setFiltroEstabelecimentoUsuariosAtivos
                  )
                  }
                />
              </div>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroPeriodo(
                    competencias,
                    filtroCompetenciaUsuariosAtivos,
                    setFiltroCompetenciaUsuariosAtivos,
                    false
                  )
                  }
                />
              </div>
            </div>

            { loadingCondicao
              ? <Spinner theme="ColorSM" height="70vh" />
              : <div className={ styles.GraficosUsuariosAtivosContainer }>
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
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { usuariosPorRacaECor.length !== 0
        && competencias.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroEstabelecimento(
                    estabelecimentos,
                    filtroEstabelecimentoRacaCor,
                    setFiltroEstabelecimentoRacaCor
                  )
                  }
                />
              </div>
              <div className={ styles.Filtro }>
                <Select
                  { ...getPropsFiltroPeriodo(
                    competencias,
                    filtroCompetenciaRacaCor,
                    setFiltroCompetenciaRacaCor,
                    false
                  )
                  }
                />
              </div>
            </div>

            { loadingRaca
              ? <Spinner theme="ColorSM" height="70vh" />
              : <ReactEcharts
                option={ getOpcoesGraficoRacaEcor(
                  agregadosPorRacaCor,
                  "Usuários ativos"
                ) }
                style={ { width: "100%", height: "70vh" } }
              />
            }
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
