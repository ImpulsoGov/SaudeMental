import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from "../../../requests/outros-raps";
import styles from "../OutrosRaps.module.css";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ConsultorioNaRua = () => {
  const { data: session } = useSession();
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentos12meses, setAtendimentos12meses] = useState([]);
  const [filtroProducao, setFiltroProducao] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroCompetencia, setFiltroCompetencia] = useState({
    value: "Último período", label: "Último período"
  });

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendimentos(await getAtendimentosConsultorioNaRua(municipioIdSus));
      setAtendimentos12meses(
        await getAtendimentosConsultorioNaRua12meses(municipioIdSus)
      );
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const agregarPorProducao = (atendimentos) => {
    const atendimentosAgregados = [];

    atendimentos.forEach((atendimento) => {
      const { tipo_producao: tipoProducao, competencia, periodo, quantidade_registrada: quantidadeRegistrada } = atendimento;
      const atendimentoEncontrado = atendimentosAgregados.find((item) => item.tipoProducao === tipoProducao);

      if (!atendimentoEncontrado) {
        atendimentosAgregados.push({
          tipoProducao,
          quantidadesPorPeriodo: [{ competencia, periodo, quantidadeRegistrada }]
        });
      } else {
        atendimentoEncontrado.quantidadesPorPeriodo.push({ competencia, periodo, quantidadeRegistrada });
      }
    });

    return atendimentosAgregados;
  };

  const ordenarQuantidadesPorCompetenciaAsc = (atendimentos) => {
    return atendimentos.map(({ tipoProducao, quantidadesPorPeriodo }) => ({
      tipoProducao,
      quantidadesPorPeriodo: quantidadesPorPeriodo
        .sort((a, b) => new Date(a.competencia) - new Date(b.competencia))
    }));
  };

  const getOpcoesGraficoDeLinha = (atendimentos) => {
    const atendimentosAgregados = agregarPorProducao(atendimentos);
    const atendimentosOrdenados = ordenarQuantidadesPorCompetenciaAsc(atendimentosAgregados);

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
        data: atendimentosOrdenados[0].quantidadesPorPeriodo.map(({ periodo }) => periodo)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: "Atendimentos realizados",
          data: atendimentosOrdenados
            .find(({ tipoProducao }) => tipoProducao === filtroProducao.value).quantidadesPorPeriodo
            .map(({ quantidadeRegistrada }) => quantidadeRegistrada),
          type: 'line',
          itemStyle: {
            color: "#5367C9"
          },
        }
      ]
    };
  };

  const agregarPorPeriodo = (atendimentos) => {
    const atendimentosAgregados = [];

    atendimentos.forEach((atendimento) => {
      const { tipo_producao: tipoProducao, competencia, periodo, quantidade_registrada: quantidadeRegistrada } = atendimento;
      const atendimentoEncontrado = atendimentosAgregados.find((item) => item.periodo === periodo);

      if (!atendimentoEncontrado) {
        atendimentosAgregados.push({
          periodo,
          competencia,
          quantidadesPorProducao: [{ tipoProducao, quantidadeRegistrada }]
        });
      } else {
        atendimentoEncontrado.quantidadesPorProducao.push({ tipoProducao, quantidadeRegistrada });
      }
    });

    return atendimentosAgregados;
  };

  const getOpcoesGraficoDonut = (atendimentos) => {
    const atendimentosAgregados = agregarPorPeriodo(atendimentos);

    const { quantidadesPorProducao } = atendimentosAgregados
      .find(({ periodo }) => periodo === filtroCompetencia.value);

    const quantidadesPorProducaoFiltradas = quantidadesPorProducao
      .filter(({ tipoProducao }) => tipoProducao !== "Todos")
      .sort((a, b) => a.tipoProducao.localeCompare(b.tipoProducao));

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
          data: [
            {
              value: quantidadesPorProducaoFiltradas[0].quantidadeRegistrada,
              name: quantidadesPorProducaoFiltradas[0].tipoProducao,
              itemStyle: {
                color: "#5367C9"
              },
            },
            {
              value: quantidadesPorProducaoFiltradas[1].quantidadeRegistrada,
              name: quantidadesPorProducaoFiltradas[1].tipoProducao,
              itemStyle: {
                color: "#6577CF"
              },
            },
            {
              value: quantidadesPorProducaoFiltradas[2].quantidadeRegistrada,
              name: quantidadesPorProducaoFiltradas[2].tipoProducao,
              itemStyle: {
                color: "#7685D4"
              },
            },
            {
              value: quantidadesPorProducaoFiltradas[3].quantidadeRegistrada,
              name: quantidadesPorProducaoFiltradas[3].tipoProducao,
              itemStyle: {
                color: "#8795DA"
              },
            },
          ]
        }
      ]
    };
  };

  const getPropsCardUltimoPeriodo = () => {
    const atendimentoTodosUltimoPeriodo = atendimentos
      .find((atendimento) => atendimento.tipo_producao === "Todos" && atendimento.periodo === "Último período");

    return {
      key: uuidv1(),
      indicador: atendimentoTodosUltimoPeriodo["quantidade_registrada"],
      titulo: `Total de atendimentos em ${atendimentoTodosUltimoPeriodo["nome_mes"]}`,
      indice: atendimentoTodosUltimoPeriodo["dif_quantidade_registrada_anterior"],
      indiceDescricao: "últ. mês"
    };
  };

  const getPropsCardUltimos12Meses = () => {
    const atendimentoTodosUltimos12Meses = atendimentos12meses
      .find(({ tipo_producao: tipoProducao }) => tipoProducao === "Todos");

    return {
      key: uuidv1(),
      indicador: atendimentoTodosUltimos12Meses["quantidade_registrada"],
      titulo: "Total de atendimentos nos últimos 12 meses",
      indice: atendimentoTodosUltimos12Meses["dif_quantidade_registrada_anterior"],
      indiceDescricao: "doze meses anteriores"
    };
  };

  const getPropsFiltroCompetencia = (atendimentos) => {
    const periodosOrdemDesc = agregarPorPeriodo(atendimentos)
      .sort((a, b) => new Date(b.competencia) - new Date(a.competencia))
      .map(({ periodo }) => ({ value: periodo, label: periodo }));

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Competência: { children }
      </components.Control>
    );

    return {
      options: periodosOrdemDesc,
      defaultValue: filtroCompetencia,
      selectedValue: filtroCompetencia,
      onChange: (selected) => setFiltroCompetencia({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      components: { Control: optionPersonalizada },
      styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
    };
  };

  const getPropsFiltroProducao = (atendimentos) => {
    const atendimentosAgregados = agregarPorProducao(atendimentos)
      .map(({ tipoProducao }) => ({ value: tipoProducao, label: tipoProducao }));

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Tipo de produção: { children }
      </components.Control>
    );

    return {
      options: atendimentosAgregados,
      defaultValue: filtroProducao,
      selectedValue: filtroProducao,
      onChange: (selected) => setFiltroProducao({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      components: { Control: optionPersonalizada },
      styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
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
        titulo="<strong>Consultório na Rua</strong>"
      />

      <GraficoInfo
        titulo="Atendimentos realizados por equipes"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
      />

      <Grid12Col
        items={ [
          <>
            { atendimentos.length !== 0 &&
              <CardInfoTipoA { ...getPropsCardUltimoPeriodo() } />
            }
          </>,
          <>
            { atendimentos12meses.length !== 0 &&
              <CardInfoTipoA { ...getPropsCardUltimos12Meses() } />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Tipo de produção"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
      />

      { atendimentos.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select { ...getPropsFiltroCompetencia(atendimentos) } />
          </div>

          <div className={ styles.GraficoDonutContainer }>
            <ReactEcharts
              option={ getOpcoesGraficoDonut(atendimentos) }
              style={ { width: "40%", height: "100%" } }
            />
          </div>
        </>
      }

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
      />

      { atendimentos.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select { ...getPropsFiltroProducao(atendimentos) } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoDeLinha(atendimentos) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }
    </div>
  );
};

export default ConsultorioNaRua;
