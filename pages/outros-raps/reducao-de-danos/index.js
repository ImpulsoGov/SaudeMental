import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAcoesReducaoDeDanos, getAcoesReducaoDeDanos12meses } from "../../../requests/outros-raps";
import styles from "../OutrosRaps.module.css";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ReducaoDeDanos = () => {
  const { data: session } = useSession();
  const [acoes, setAcoes] = useState([]);
  const [acoes12meses, setAcoes12meses] = useState([]);
  const [filtroEstabelecimento, setFiltroEstabelecimento] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroOcupacao, setFiltroOcupacao] = useState({
    value: "Todas", label: "Todas"
  });

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAcoes(await getAcoesReducaoDeDanos(municipioIdSus));
      // remover id_sus específico quando já houver todos no banco
      setAcoes12meses(await getAcoesReducaoDeDanos12meses(350950));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const getPropsCardUltimoPeriodo = (acoes) => {
    const acaoTodosUltimoPeriodo = acoes
      .find((acao) => acao.estabelecimento === "Todos" && acao.profissional_vinculo_ocupacao === "Todas" && acao.periodo === "Último período");

    return {
      key: uuidv1(),
      indicador: acaoTodosUltimoPeriodo["quantidade_registrada"],
      titulo: `Total de ações de redução de danos em ${acaoTodosUltimoPeriodo["nome_mes"]}`,
      indice: acaoTodosUltimoPeriodo["dif_quantidade_registrada_anterior"],
      indiceDescricao: "últ. mês"
    };
  };

  const getPropsCardUltimos12Meses = (acoes) => {
    const acaoTodosUltimos12Meses = acoes
      .find((acao) => acao.estabelecimento === "Todos" && acao.profissional_vinculo_ocupacao === "Todas");

    return {
      key: uuidv1(),
      indicador: acaoTodosUltimos12Meses["quantidade_registrada"],
      titulo: `Total de ações de redução de danos entre ${acaoTodosUltimos12Meses["a_partir_do_mes"]} de ${acaoTodosUltimos12Meses["a_partir_do_ano"]} e ${acaoTodosUltimos12Meses["ate_mes"]} de ${acaoTodosUltimos12Meses["ate_ano"]}`,
      indice: acaoTodosUltimos12Meses["dif_quantidade_registrada_anterior"],
      indiceDescricao: "doze meses anteriores"
    };
  };

  const agregarPorEstabelecimentoEOcupacao = (acoes) => {
    const acoesAgregadas = [];

    acoes.forEach((acao) => {
      const { estabelecimento, competencia, periodo, quantidade_registrada: quantidadeRegistrada, profissional_vinculo_ocupacao: ocupacao } = acao;
      const acaoEncontrada = acoesAgregadas
        .find((item) => item.estabelecimento === estabelecimento && item.ocupacao === ocupacao);

      if (!acaoEncontrada) {
        acoesAgregadas.push({
          ocupacao,
          estabelecimento,
          quantidadesPorPeriodo: [{ competencia, periodo, quantidadeRegistrada }]
        });
      } else {
        acaoEncontrada.quantidadesPorPeriodo.push({ competencia, periodo, quantidadeRegistrada });
      }
    });

    return acoesAgregadas;
  };

  const ordenarQuantidadesPorCompetenciaAsc = (acoes) => {
    return acoes.map(({ estabelecimento, ocupacao, quantidadesPorPeriodo }) => ({
      ocupacao,
      estabelecimento,
      quantidadesPorPeriodo: quantidadesPorPeriodo
        .sort((a, b) => new Date(a.competencia) - new Date(b.competencia))
    }));
  };

  const getPropsFiltroEstabelecimento = (acoes) => {
    const optionsSemDuplicadas = [];

    acoes.forEach(({ estabelecimento }) => {
      const acaoEncontrada = optionsSemDuplicadas
        .find((item) => item.value === estabelecimento);

      if (!acaoEncontrada) {
        optionsSemDuplicadas.push({ value: estabelecimento, label: estabelecimento });
      }
    });

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Estabelecimento: { children }
      </components.Control>
    );

    return {
      options: optionsSemDuplicadas,
      defaultValue: filtroEstabelecimento,
      selectedValue: filtroEstabelecimento,
      onChange: (selected) => setFiltroEstabelecimento({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      components: { Control: optionPersonalizada },
      styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
    };
  };

  const getPropsFiltroOcupacao = (acoes) => {
    const optionsSemDuplicadas = [];

    acoes
      .filter(({ estabelecimento }) => estabelecimento === filtroEstabelecimento.value)
      .forEach(({ profissional_vinculo_ocupacao: ocupacao }) => {
        const acaoEncontrada = optionsSemDuplicadas
          .find((item) => item.value === ocupacao);

        if (!acaoEncontrada) {
          optionsSemDuplicadas.push({ value: ocupacao, label: ocupacao });
        }
      });

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        CBO do profissional: { children }
      </components.Control>
    );

    return {
      options: optionsSemDuplicadas,
      defaultValue: filtroOcupacao,
      selectedValue: filtroOcupacao,
      onChange: (selected) => setFiltroOcupacao({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      components: { Control: optionPersonalizada },
      styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
    };
  };

  const getOpcoesGraficoDeLinha = (acoes) => {
    const acoesAgregadas = agregarPorEstabelecimentoEOcupacao(acoes);
    const acoesOrdenadas = ordenarQuantidadesPorCompetenciaAsc(acoesAgregadas);
    const acaoFiltrada = acoesOrdenadas.find(({ estabelecimento, ocupacao }) =>
      estabelecimento === filtroEstabelecimento.value && ocupacao === filtroOcupacao.value
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
        data: acaoFiltrada.quantidadesPorPeriodo.map(({ periodo }) => periodo)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: "Ações registradas",
          data: acaoFiltrada.quantidadesPorPeriodo
            .map(({ quantidadeRegistrada }) => quantidadeRegistrada),
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
        titulo="<strong>Ações de Redução de Danos</strong>"
      />

      <GraficoInfo
        titulo="Ações de redução de danos realizadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        tooltip="Total de procedimentos registrados como 'ação de redução de danos', segundo informado pelos profissionais de saúde por meios dos Boletins de Produção Ambulatorial consolidados (BPA-c)."
      />

      <Grid12Col
        items={ [
          <>
            { acoes.length !== 0 &&
              <CardInfoTipoA { ...getPropsCardUltimoPeriodo(acoes) } />
            }
          </>,
          <>
            { acoes12meses.length !== 0 &&
              <CardInfoTipoA { ...getPropsCardUltimos12Meses(acoes12meses) } />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      { acoes.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select { ...getPropsFiltroEstabelecimento(acoes) } />
            </div>
            <div className={ styles.Filtro }>
              <Select { ...getPropsFiltroOcupacao(acoes) } />
            </div>
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoDeLinha(acoes) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }
    </div>
  );
};

export default ReducaoDeDanos;
