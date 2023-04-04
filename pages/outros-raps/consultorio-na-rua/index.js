import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from "../../../requests/outros-raps";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const SelectControl = ({ children, ...props }) => (
  <components.Control { ...props }>
    Tipo de produção: { children }
  </components.Control>
);

const ConsultorioNaRua = () => {
  const { data: session } = useSession();
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentos12meses, setAtendimentos12meses] = useState([]);
  const [filtroProducao, setFiltroProducao] = useState({ value: "Todos", label: "Todos" });

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

  const getQuantidade12meses = (atendimentos) => {
    return atendimentos.find(({ tipo_producao: tipoProducao }) => tipoProducao === "Todos")["quantidade_registrada"];
  };

  const getDiferenca12meses = (atendimentos) => {
    return atendimentos.find(({ tipo_producao: tipoProducao }) => tipoProducao === "Todos")["dif_quantidade_registrada_anterior"];
  };

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

  const ordenarQuantidadesPorCompetencia = (atendimentos) => {
    return atendimentos.map(({ tipoProducao, quantidadesPorPeriodo }) => ({
      tipoProducao,
      quantidadesPorPeriodo: quantidadesPorPeriodo
        .sort((a, b) => new Date(a.competencia) - new Date(b.competencia))
    }));
  };

  const getOpcoesGraficoAtendimentos = (atendimentos) => {
    const atendimentosAgregados = agregarPorProducao(atendimentos);
    const atendimentosOrdenados = ordenarQuantidadesPorCompetencia(atendimentosAgregados);

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
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ atendimentos.find((atendimento) => atendimento.tipo_producao === "Todos" && atendimento.periodo === "Último período")["quantidade_registrada"] }
                titulo={ `Total de atendimentos em ${atendimentos.find((atendimento) => atendimento.tipo_producao === "Todos" && atendimento.periodo === "Último período")["nome_mes"]}` }
                indice={ atendimentos.find((atendimento) => atendimento.tipo_producao === "Todos" && atendimento.periodo === "Último período")["dif_quantidade_registrada_anterior"] }
                indiceDescricao="últ. mês"
              />
            }
          </>,
          <>
            { atendimentos12meses.length !== 0 &&
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getQuantidade12meses(atendimentos12meses) }
                titulo={ `Total de atendimentos nos últimos 12 meses` }
                indice={ getDiferenca12meses(atendimentos12meses) }
                indiceDescricao="doze meses anteriores"
              />
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
          <div style={ { width: "50%", fontSize: "14px" } }>
            <Select
              options={ agregarPorProducao(atendimentos).map(({ tipoProducao }) => ({ value: tipoProducao, label: tipoProducao })) }
              defaultValue={ filtroProducao }
              selectedValue={ filtroProducao }
              onChange={ (selected) => setFiltroProducao({ value: selected.value, label: selected.value }) }
              isMulti={ false }
              components={ { Control: SelectControl } }
              styles={ { control: (css) => ({ ...css, paddingLeft: '15px' }) } }
            />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoAtendimentos(atendimentos) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
      />

      { atendimentos.length !== 0 &&
        <>
          <div style={ { width: "50%", fontSize: "14px" } }>
            <Select
              options={ agregarPorProducao(atendimentos).map(({ tipoProducao }) => ({ value: tipoProducao, label: tipoProducao })) }
              defaultValue={ filtroProducao }
              selectedValue={ filtroProducao }
              onChange={ (selected) => setFiltroProducao({ value: selected.value, label: selected.value }) }
              isMulti={ false }
              components={ { Control: SelectControl } }
              styles={ { control: (css) => ({ ...css, paddingLeft: '15px' }) } }
            />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoAtendimentos(atendimentos) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }
    </div>
  );
};

export default ConsultorioNaRua;
