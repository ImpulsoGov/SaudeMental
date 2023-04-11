import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getProcedimentosPorEstabelecimento } from "../../../requests/caps";
import styles from "../Caps.module.css";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ProcedimentosPorUsuarios = () => {
  const { data: session } = useSession();
  const [procedimentosPorEstabelecimento, setProcedimentosPorEstabelecimento] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: "Todos", label: "Todos"
  });

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setProcedimentosPorEstabelecimento(
        await getProcedimentosPorEstabelecimento(municipioIdSus)
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
        procedimentos_por_usuario: procedimentosPorUsuario,
        dif_procedimentos_por_usuario_anterior_perc: difPorcentagemProcedimentosAnterior
      } = procedimento;

      const linhaPerfilEncontrada = procedimentosAgregados
        .find((item) => item.linhaPerfil === linhaPerfil);

      if (!linhaPerfilEncontrada) {
        procedimentosAgregados.push({
          nomeMes,
          linhaPerfil,
          procedimentosPorEstabelecimento: [{
            estabelecimento,
            procedimentosPorUsuario,
            difPorcentagemProcedimentosAnterior
          }]
        });
      } else {
        linhaPerfilEncontrada.procedimentosPorEstabelecimento.push({
          estabelecimento,
          procedimentosPorUsuario,
          difPorcentagemProcedimentosAnterior
        });
      }
    });

    return procedimentosAgregados;
  };

  const getCardsProcedimentosPorEstabelecimento = (procedimentos) => {
    const procedimentosPorEstabelecimentoUltimoPeriodo = procedimentos
      .filter(({ periodo, estabelecimento }) => periodo === "Último período" && estabelecimento !== "Todos");

    const procedimentosAgregados = agregarPorLinhaPerfil(procedimentosPorEstabelecimentoUltimoPeriodo);

    const cardsProcedimentosPorEstabelecimento = procedimentosAgregados.map(({
      linhaPerfil, procedimentosPorEstabelecimento, nomeMes
    }) => (
      <>
        <GraficoInfo
          titulo={ `CAPS ${linhaPerfil}` }
          descricao={ `Dados de ${nomeMes}` }
        />

        <Grid12Col
          items={
            procedimentosPorEstabelecimento.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.procedimentosPorUsuario }
                indice={ item.difPorcentagemProcedimentosAnterior }
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

    return cardsProcedimentosPorEstabelecimento;
  };

  const agregarPorEstabelecimentoEPeriodo = (procedimentos) => {
    const procedimentosAgregados = [];

    procedimentos.forEach((procedimento) => {
      const {
        periodo,
        competencia,
        estabelecimento,
        procedimentos_por_usuario: procedimentosPorUsuario,
      } = procedimento;

      const estabelecimentoEncontrado = procedimentosAgregados
        .find((item) => item.estabelecimento === estabelecimento);

      if (!estabelecimentoEncontrado) {
        procedimentosAgregados.push({
          estabelecimento,
          procedimentosPorPeriodo: [{
            periodo,
            competencia,
            procedimentosPorUsuario
          }]
        });
      } else {
        estabelecimentoEncontrado.procedimentosPorPeriodo.push({
          periodo,
          competencia,
          procedimentosPorUsuario
        });
      }
    });

    return procedimentosAgregados;
  };

  const ordenarProcedimentosPorCompetenciaAsc = (procedimentos) => {
    return procedimentos.map(({ estabelecimento, procedimentosPorPeriodo }) => ({
      estabelecimento,
      procedimentosPorPeriodo: procedimentosPorPeriodo
        .sort((a, b) => new Date(a.competencia) - new Date(b.competencia))
    }));
  };

  const getOpcoesGraficoHistoricoTemporal = (procedimentos, filtroEstabelecimento) => {
    const procedimentosAgregados = agregarPorEstabelecimentoEPeriodo(procedimentos);
    const procedimentosOrdenados = ordenarProcedimentosPorCompetenciaAsc(procedimentosAgregados);
    const procedimentosDeEstabelecimentoFiltrado = procedimentosOrdenados
      .find(({ estabelecimento }) => estabelecimento === filtroEstabelecimento);

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
        data: procedimentosDeEstabelecimentoFiltrado.procedimentosPorPeriodo
          .map(({ periodo }) => periodo)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: procedimentosDeEstabelecimentoFiltrado.estabelecimento,
          data: procedimentosDeEstabelecimentoFiltrado.procedimentosPorPeriodo
            .map(({ procedimentosPorUsuario }) => procedimentosPorUsuario),
          type: 'line',
          itemStyle: {
            color: "#5367C9"
          },
        }
      ]
    };
  };

  const getPropsFiltroEstabelecimento = (procedimentos) => {
    const procedimentosPorEstabelecimento = agregarPorEstabelecimentoEPeriodo(procedimentos);
    const options = procedimentosPorEstabelecimento
      .map(({ estabelecimento }) => ({
        value: estabelecimento,
        label: estabelecimento
      }));

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Estabelecimento: { children }
      </components.Control>
    );

    return {
      options,
      defaultValue: filtroEstabelecimentoHistorico,
      selectedValue: filtroEstabelecimentoHistorico,
      onChange: (selected) => setFiltroEstabelecimentoHistorico({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      isSearchable: false,
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
        titulo="<strong>Procedimentos por usuários</strong>"
      />

      <GraficoInfo
        descricao="Taxa de procedimentos registrados pelo número de usuários com fichas movimentadas durante o mês de referência"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      {
        procedimentosPorEstabelecimento.length !== 0
        && getCardsProcedimentosPorEstabelecimento(procedimentosPorEstabelecimento)
      }

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { procedimentosPorEstabelecimento.length !== 0 &&
        <>
          <div className={ styles.Filtro }>
            <Select {
              ...getPropsFiltroEstabelecimento(procedimentosPorEstabelecimento)
            } />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoHistoricoTemporal(
              procedimentosPorEstabelecimento,
              filtroEstabelecimentoHistorico.value
            ) }
            style={ { width: "100%", height: "70vh" } }
          />
        </>
      }

      <GraficoInfo
        titulo="Procedimento por usuários x tempo do usuário no serviço"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />
    </div>
  );
};

export default ProcedimentosPorUsuarios;
