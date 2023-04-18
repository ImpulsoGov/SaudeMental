import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAbandonoCoortes, getPerfilAbandono } from "../../../requests/caps";

import ReactEcharts from "echarts-for-react";
import Select from "react-select";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { agregarPorCondicaoSaude, getOpcoesGraficoCID } from "../../../helpers/graficoCID";
import { agregarPorFaixaEtariaEGenero, getOpcoesGraficoGeneroEFaixaEtaria } from "../../../helpers/graficoGeneroEFaixaEtaria";
import { getOpcoesGraficoHistoricoTemporal } from "../../../helpers/graficoHistoricoTemporal";
import { agregarPorRacaCor, getOpcoesGraficoRacaEcor } from "../../../helpers/graficoRacaECor";
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

const TaxaAbandono = () => {
  const { data: session } = useSession();
  const [abandonoCoortes, setAbandonoCoortes] = useState([]);
  const [abandonoPerfil, setAbandonoPerfil] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroPeriodoCID, setFiltroPeriodoCID] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoRacaECor, setFiltroPeriodoRacaECor] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoRacaECor, setFiltroEstabelecimentoRacaECor] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);

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
          titulo="Taxa de não adesão acumulada"
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

  const filtrarPorEstabelecimento = (dados, filtroEstabelecimento) => {
    return dados
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento.value
      );
  };

  const filtrarPorPeriodoEstabelecimento = (dados, filtroEstabelecimento, filtroPeriodo) => {
    const periodosSelecionados = filtroPeriodo.map(({ value }) => value);

    return dados.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && periodosSelecionados.includes(item.periodo)
    );
  };

  const agregadosPorCondicaoSaude = agregarPorCondicaoSaude(
    filtrarPorPeriodoEstabelecimento(abandonoPerfil, filtroEstabelecimentoCID, filtroPeriodoCID),
    "grupo_descricao_curta_cid10",
    "quantidade_registrada"
  );

  const agregadosPorGeneroEFaixaEtaria = agregarPorFaixaEtariaEGenero(
    filtrarPorPeriodoEstabelecimento(abandonoPerfil, filtroEstabelecimentoGenero, filtroPeriodoGenero),
    "usuario_faixa_etaria_descricao",
    "usuario_sexo",
    "quantidade_registrada"
  );

  const agregadosPorRacaCor = agregarPorRacaCor(
    filtrarPorPeriodoEstabelecimento(abandonoPerfil, filtroEstabelecimentoGenero, filtroPeriodoGenero),
    "usuario_raca_cor",
    "quantidade_registrada"
  );

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
        descricao="Dos usuários acolhidos há menos de 3 meses, quantos abandonaram o serviço no mês"
        tooltip="A taxa de não adesão acumulada se refere à porcentagem de usuários que entraram no serviço em um dado mês e abandonaram o serviço em algum dos 3 meses seguintes. A taxa de não adesão mensal se refere à quantidade de usuários que haviam entrado no serviço recentemente e abandonaram o serviço no mês especificado."
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
              filtrarPorEstabelecimento(abandonoCoortes, filtroEstabelecimentoHistorico),
              "usuarios_coorte_nao_aderiram_perc",
              "Taxa de não adesão mensal (%):"
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
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  abandonoPerfil,
                  filtroEstabelecimentoCID,
                  setFiltroEstabelecimentoCID
                )
              } />
            </div>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  abandonoPerfil,
                  filtroPeriodoCID,
                  setFiltroPeriodoCID
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

      { abandonoPerfil.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  abandonoPerfil,
                  filtroEstabelecimentoGenero,
                  setFiltroEstabelecimentoGenero
                )
              } />
            </div>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  abandonoPerfil,
                  filtroPeriodoGenero,
                  setFiltroPeriodoGenero
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoGeneroEFaixaEtaria(
              agregadosPorGeneroEFaixaEtaria,
              ""
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
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  abandonoPerfil,
                  filtroEstabelecimentoRacaECor,
                  setFiltroEstabelecimentoRacaECor
                )
              } />
            </div>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  abandonoPerfil,
                  filtroPeriodoRacaECor,
                  setFiltroPeriodoRacaECor
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoRacaEcor(
              agregadosPorRacaCor,
              "Usuários recentes que abandonaram no período"
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
