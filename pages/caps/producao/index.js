import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Select from "react-select";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodoMulti } from "../../../helpers/filtrosGraficos";
import styles from "../Caps.module.css";
import porHora from "./porHora.json";

const OCUPACOES_NAO_ACEITAS = ["Todas", null];

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Producao = () => {
  const { data: session } = useSession();
  const [procedimentosPorHora, setProcedimentosPorHora] = useState(porHora);
  const [filtroEstabelecimentoCBO, setFiltroEstabelecimentoCBO] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroPeriodoCBO, setFiltroPeriodoCBO] = useState([
    { value: "Último período", label: "Último período" },
  ]);

  // useEffect(() => {
  //   const getDados = async (municipioIdSus) => {
  //     setProcedimentosPorHora(await getProcedimentosPorHora(municipioIdSus));
  //   };

  //   if (session?.user.municipio_id_ibge) {
  //     getDados(session?.user.municipio_id_ibge);
  //   }
  // }, []);

  const agregarPorLinhaPerfil = (procedimentos) => {
    const procedimentosAgregados = [];

    procedimentos.forEach((procedimento) => {
      const {
        estabelecimento,
        nome_mes: nomeMes,
        estabelecimento_linha_perfil: linhaPerfil,
        procedimentos_por_hora: procedimentosPorHora,
        perc_dif_procedimentos_por_hora_anterior: porcentagemDifProcedimentosPorHoraAnterior
      } = procedimento;

      const linhaPerfilEncontrada = procedimentosAgregados
        .find((item) => item.linhaPerfil === linhaPerfil);

      if (!linhaPerfilEncontrada) {
        procedimentosAgregados.push({
          nomeMes,
          linhaPerfil,
          procedimentosPorEstabelecimento: [{
            estabelecimento,
            procedimentosPorHora,
            porcentagemDifProcedimentosPorHoraAnterior
          }]
        });
      } else {
        linhaPerfilEncontrada.procedimentosPorEstabelecimento.push({
          estabelecimento,
          procedimentosPorHora,
          porcentagemDifProcedimentosPorHoraAnterior
        });
      }
    });

    return procedimentosAgregados;
  };

  const getCardsProcedimentosHoraPorEstabelecimento = (procedimentos) => {
    const procedimentosPorHoraUltimoPeriodo = procedimentos
      .filter(({ periodo, estabelecimento, estabelecimento_linha_perfil: linhaPerfil }) =>
        periodo === "Último período"
        && estabelecimento !== "Todos"
        && linhaPerfil !== "Todos"
      );

    const procedimentosAgregados = agregarPorLinhaPerfil(procedimentosPorHoraUltimoPeriodo);

    const cardsProcedimentosHoraPorEstabelecimento = procedimentosAgregados.map(({
      linhaPerfil, procedimentosPorEstabelecimento, nomeMes
    }) => (
      <>
        <GraficoInfo
          titulo={ `CAPS ${linhaPerfil}` }
          descricao="Comparativo de produção por hora de trabalho dos profissionais nos CAPS"
          fonte={ `Dados de ${nomeMes}` }
          tooltip="a"
        />

        <Grid12Col
          items={
            procedimentosPorEstabelecimento.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.procedimentosPorHora }
                indicarDescricao="procedimentos/hora"
                indice={ item.porcentagemDifProcedimentosPorHoraAnterior }
                indiceSimbolo="%"
                indiceDescricao="últ. mês"
                key={ uuidv1() }
              />
            ))
          }
          proporcao="3-3-3-3"
        />
      </>
    ));

    return cardsProcedimentosHoraPorEstabelecimento;
  };

  const agregarPorOcupacao = (procedimentos) => {
    const procedimentosAgregados = [];

    procedimentos.forEach((procedimento) => {
      const {
        periodo,
        ocupacao,
        procedimentos_por_hora: procedimentosPorHora
      } = procedimento;
      const procedimentoEncontrado = procedimentosAgregados
        .find((item) => item.ocupacao === ocupacao);

      if (!procedimentoEncontrado) {
        procedimentosAgregados.push({
          ocupacao,
          procedimentosPorPeriodo: [{
            periodo,
            procedimentosPorHora
          }]
        });
      } else {
        procedimentoEncontrado.procedimentosPorPeriodo.push({
          periodo,
          procedimentosPorHora
        });
      }
    });

    return procedimentosAgregados;
  };

  const filtrarPorEstabelecimentoEPeriodo = (procedimentos, filtroEstabelecimento, filtroPeriodo) => {
    const periodosSelecionados = filtroPeriodo
      .map(({ value }) => value);

    return procedimentos.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && periodosSelecionados.includes(item.periodo)
      && !OCUPACOES_NAO_ACEITAS.includes(item.ocupacao)
      && item.estabelecimento_linha_idade === "Todos"
      && item.procedimentos_por_hora
    );
  };

  const getSomaProcedimentosPorPeriodo = (procedimentosPorPeriodo) => {
    return procedimentosPorPeriodo
      .reduce((acc, { procedimentosPorHora }) =>
        acc + procedimentosPorHora,
        0);
  };

  const getOpcoesGraficoProducaoPorCBO = (procedimentos) => {
    const procedimentosFiltrados = filtrarPorEstabelecimentoEPeriodo(
      procedimentos,
      filtroEstabelecimentoCBO,
      filtroPeriodoCBO
    );
    const procedimentosAgregados = agregarPorOcupacao(procedimentosFiltrados);

    return {
      tooltip: {},
      xAxis: {
        type: 'category',
        axisLabel: {
          rotate: 35,
          width: 100,
          overflow: "break"
        },
        data: procedimentosAgregados.map(({ ocupacao }) => ocupacao)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: procedimentosAgregados.map(({ procedimentosPorPeriodo }) =>
            getSomaProcedimentosPorPeriodo(procedimentosPorPeriodo)),
          type: 'bar',
          name: 'Procedimentos por hora'
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
        titulo="<strong>Produção</strong>"
      />

      <GraficoInfo
        fonte="Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      {
        procedimentosPorHora.length !== 0
        && getCardsProcedimentosHoraPorEstabelecimento(procedimentosPorHora)
      }

      <GraficoInfo
        titulo="Produção por hora de trabalho por CBO"
        descricao="Normalizado por horas de trabalho"
        fonte="Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { procedimentosPorHora.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  procedimentosPorHora,
                  filtroEstabelecimentoCBO,
                  setFiltroEstabelecimentoCBO
                )
              } />
            </div>

            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodoMulti(
                  procedimentosPorHora,
                  filtroPeriodoCBO,
                  setFiltroPeriodoCBO
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoProducaoPorCBO(
              procedimentosPorHora
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

export default Producao;
