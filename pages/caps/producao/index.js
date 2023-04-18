import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { v1 as uuidv1 } from "uuid";
import { CORES_GRAFICO_DONUT } from "../../../constants/CORES_GRAFICO_DONUT";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getPropsFiltroEstabelecimento, getPropsFiltroPeriodo } from "../../../helpers/filtrosGraficos";
import { getProcedimentosPorHora, getProcedimentosPorTipo } from "../../../requests/caps";
import styles from "../Caps.module.css";

const OCUPACOES_NAO_ACEITAS = ["Todas", null];
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

const Producao = () => {
  const { data: session } = useSession();
  const [procedimentosPorHora, setProcedimentosPorHora] = useState([]);
  const [procedimentosPorTipo, setProcedimentosPorTipo] = useState([]);
  const [filtroEstabelecimentoCBO, setFiltroEstabelecimentoCBO] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoCBO, setFiltroPeriodoCBO] = useState({ value: "Último período", label: "Último período" });
  const [filtroEstabelecimentoBPA, setFiltroEstabelecimentoBPA] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoBPA, setFiltroPeriodoBPA] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoRAAS, setFiltroEstabelecimentoRAAS] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoRAAS, setFiltroPeriodoRAAS] = useState(FILTRO_PERIODO_MULTI_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setProcedimentosPorHora(await getProcedimentosPorHora(municipioIdSus));
      setProcedimentosPorTipo(
        await getProcedimentosPorTipo(municipioIdSus)
      );
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

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
      .filter(({
        periodo,
        estabelecimento,
        ocupacao,
        estabelecimento_linha_perfil: linhaPerfil,
        estabelecimento_linha_idade: linhaIdade,
        procedimentos_por_hora: procedimentosPorHora
      }) =>
        periodo === "Último período"
        && estabelecimento !== "Todos"
        && linhaPerfil !== "Todos"
        && procedimentosPorHora
        && ocupacao === "Todas"
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
          tooltip="Indicador é calculado a partir da divisão do total de procedimentos registrados pelo total de horas de trabalho estabelecidas em contrato. De tal modo, dados podem apresentar valores subestimados no caso de férias, licenças, feriados e números de finais de semana no mês."
        />

        <Grid12Col
          items={
            procedimentosPorEstabelecimento.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.procedimentosPorHora }
                indicadorDescricao="procedimentos/hora"
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

  const getValoresPeriodosSelecionados = (periodosSelecionados) => {
    return periodosSelecionados.map(({ value }) => value);
  };

  const filtrarPorHoraEstabelecimentoEPeriodo = (procedimentos, filtroEstabelecimento, filtroPeriodo) => {
    return procedimentos.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && item.periodo === filtroPeriodo.value
      && !OCUPACOES_NAO_ACEITAS.includes(item.ocupacao)
      && item.procedimentos_por_hora
      && item.estabelecimento_linha_perfil === "Todos"
      && item.estabelecimento_linha_idade === "Todos"
    );
  };

  const filtrarPorTipoEstabelecimentoEPeriodo = (procedimentos, filtroEstabelecimento, filtroPeriodo) => {
    const periodosSelecionados = getValoresPeriodosSelecionados(filtroPeriodo);

    return procedimentos.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && periodosSelecionados.includes(item.periodo)
    );
  };

  const getSomaProcedimentosPorPeriodo = (procedimentosPorPeriodo) => {
    return procedimentosPorPeriodo
      .reduce((acc, { procedimentosPorHora }) =>
        acc + procedimentosPorHora,
        0);
  };

  const getOpcoesGraficoProducaoPorCBO = (procedimentos) => {
    const procedimentosFiltrados = filtrarPorHoraEstabelecimentoEPeriodo(
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

  const agregarPorProcedimentoTipo = (procedimentos) => {
    const procedimentosAgregados = [];

    procedimentos.forEach((item) => {
      const {
        procedimento,
        procedimentos_registrados_bpa: procedimentosBPA,
        procedimentos_registrados_raas: procedimentosRAAS,
        procedimentos_registrados_total: procedimentosTotal
      } = item;
      const procedimentoEncontrado = procedimentosAgregados
        .find((item) => item.procedimento === procedimento);

      if (!procedimentoEncontrado) {
        procedimentosAgregados.push({
          procedimento,
          quantidadeBPA: procedimentosBPA,
          quantidadeRAAS: procedimentosRAAS,
          quantidadeTotal: procedimentosTotal,
        });
      } else {
        procedimentoEncontrado.quantidadeBPA += procedimentosBPA;
        procedimentoEncontrado.quantidadeRAAS += procedimentosRAAS;
        procedimentoEncontrado.quantidadeTotal += procedimentosTotal;
      }
    });

    return procedimentosAgregados;
  };

  const getOpcoesGraficoTiposProcedimento = (procedimentos, tipo, filtroEstabelecimento, filtroPeriodo) => {
    const PROPIEDADES_POR_TIPO = {
      BPA: "quantidadeBPA",
      RAAS: "quantidadeRAAS"
    };

    const propriedade = PROPIEDADES_POR_TIPO[tipo];

    const procedimentosFiltrados = filtrarPorTipoEstabelecimentoEPeriodo(
      procedimentos,
      filtroEstabelecimento,
      filtroPeriodo
    );
    const procedimentosAgregados = agregarPorProcedimentoTipo(procedimentosFiltrados);

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
          data: procedimentosAgregados
            .filter((item) => item[propriedade] !== 0)
            .map((item, index) => ({
              value: item[propriedade],
              name: item.procedimento,
              itemStyle: {
                color: CORES_GRAFICO_DONUT[index]
              }
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
                ...getPropsFiltroPeriodo(
                  procedimentosPorHora,
                  filtroPeriodoCBO,
                  setFiltroPeriodoCBO,
                  false
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
        titulo="Procedimentos BPA"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      { procedimentosPorTipo.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  procedimentosPorTipo,
                  filtroEstabelecimentoBPA,
                  setFiltroEstabelecimentoBPA
                )
              } />
            </div>

            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  procedimentosPorTipo,
                  filtroPeriodoBPA,
                  setFiltroPeriodoBPA
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoTiposProcedimento(
              procedimentosPorTipo,
              "BPA",
              filtroEstabelecimentoBPA,
              filtroPeriodoBPA
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Procedimentos RAAS"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { procedimentosPorTipo.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  procedimentosPorTipo,
                  filtroEstabelecimentoRAAS,
                  setFiltroEstabelecimentoRAAS
                )
              } />
            </div>

            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroPeriodo(
                  procedimentosPorTipo,
                  filtroPeriodoRAAS,
                  setFiltroPeriodoRAAS
                )
              } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoTiposProcedimento(
              procedimentosPorTipo,
              "RAAS",
              filtroEstabelecimentoRAAS,
              filtroPeriodoRAAS
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }
    </div>
  );
};

export default Producao;
