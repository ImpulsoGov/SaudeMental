import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
// import { getAbandonoCoortes } from "../../../requests/caps";
import ReactEcharts from "echarts-for-react";
import Select from "react-select";
import { getPropsFiltroEstabelecimento } from "../../../helpers/filtrosGraficos";
import styles from "../Caps.module.css";
import coortes from "./coortes.json";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const TaxaAbandono = () => {
  const { data: session } = useSession();
  const [abandonoCoortes, setAbandonoCoortes] = useState(coortes);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: "Todos", label: "Todos"
  });

  // useEffect(() => {
  //   const getDados = async (municipioIdSus) => {
  //     setAbandonoCoortes(await getAbandonoCoortes(municipioIdSus));
  //   };

  //   if (session?.user.municipio_id_ibge) {
  //     getDados(session?.user.municipio_id_ibge);
  //   }
  // }, []);

  const getCardsAbandonoAcumulado = (abandonos) => {
    const abandonosUltimoPeriodo = abandonos
      .filter(({ periodo, estabelecimento }) => periodo === "Último período" && estabelecimento !== "Todos");

    return (
      <>
        <GraficoInfo
          titulo="Abandono acumulado"
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

  const getOpcoesGraficoHistoricoTemporal = (abandonoCoortes, filtroEstabelecimento) => {
    const filtradosPorEstabelecimento = abandonoCoortes
      .filter(({ estabelecimento }) =>
        estabelecimento === filtroEstabelecimento
      );

    const ordenadosPorCompetenciaAsc = filtradosPorEstabelecimento
      .sort((a, b) => new Date(a.competencia) - new Date(b.competencia));

    const periodos = ordenadosPorCompetenciaAsc.map(({ periodo }) => periodo);
    const porcentagensNaoAdesaoPorPeriodo = ordenadosPorCompetenciaAsc
      .map(({ usuarios_coorte_nao_aderiram_perc: porcentagemNaoAdesao }) =>
        porcentagemNaoAdesao
      );

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
          data: porcentagensNaoAdesaoPorPeriodo,
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
        titulo="<strong>Taxa de não adesão</strong>"
      />

      { abandonoCoortes.length !== 0 &&
        getCardsAbandonoAcumulado(abandonoCoortes)
      }

      <GraficoInfo
        titulo="Histórico Temporal"
        descricao="Dos usuários acolhidos há menos de 6 meses, quantos abandonaram o serviço no mês"
        tooltip="A taxa de não adesão acumulado se refere à porcentagem de usuários que entraram no serviço em um dado mês e abandonaram o serviço em algum dos 6 meses seguintes. A taxa de não adesão mensal se refere à quantidade de usuários que haviam entrado no serviço recentemente e abandonaram o serviço no mês especificado."
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
              abandonoCoortes,
              filtroEstabelecimentoHistorico.value
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="CID dos usuários que abandonaram o serviço"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Gênero e faixa etária"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Raça/Cor*"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        descricao="*Dados podem ter problemas de coleta, registro e preenchimento"
      />
    </div>
  );
};

export default TaxaAbandono;
