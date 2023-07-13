import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getProcedimentosPorEstabelecimento, getProcedimentosPorTempoServico } from "../../../requests/caps";
import styles from "../Caps.module.css";

import { getPropsFiltroEstabelecimento } from "../../../helpers/filtrosGraficos";
// import { getOpcoesGraficoHistoricoTemporal } from "../../../helpers/graficoHistoricoTemporal";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ProcedimentosPorUsuarios = () => {
  const { data: session } = useSession();
  const [procedimentosPorEstabelecimento, setProcedimentosPorEstabelecimento] = useState([]);
  const [procedimentosPorTempoServico, setProcedimentosPorTempoServico] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroEstabelecimentoProcedimento, setFiltroEstabelecimentoProcedimento] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroPeriodoProcedimento, setFiltroPeriodoProcedimento] = useState([
    { value: "Último período", label: "Último período" },
  ]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setProcedimentosPorEstabelecimento(await getProcedimentosPorEstabelecimento(municipioIdSus));
      setProcedimentosPorTempoServico(
        await getProcedimentosPorTempoServico(municipioIdSus)
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
      .filter(({
        periodo,
        estabelecimento,
        estabelecimento_linha_perfil: linhaPerfil,
        estabelecimento_linha_idade: linhaIdade
      }) =>
        periodo === "Último período"
        && estabelecimento !== "Todos"
        && linhaPerfil !== "Todos"
        && linhaIdade === "Todos"
      );

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

  const filtrarPorEstabelecimento = (dados, filtroEstabelecimento) => {
    return dados
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento.value
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
      );
  };

  const agregarPorTempoDeServico = (procedimentos) => {
    const procedimentosAgregados = [];

    procedimentos.forEach((procedimento) => {
      const {
        periodo,
        tempo_servico_descricao: tempoServico,
        procedimentos_por_usuario: procedimentosPorUsuario
      } = procedimento;
      const procedimentoEncontrado = procedimentosAgregados
        .find((item) => item.tempoServico === tempoServico);

      if (!procedimentoEncontrado) {
        procedimentosAgregados.push({
          tempoServico,
          procedimentosPorPeriodo: [{
            periodo,
            procedimentosPorUsuario
          }]
        });
      } else {
        procedimentoEncontrado.procedimentosPorPeriodo.push({
          periodo,
          procedimentosPorUsuario
        });
      }
    });

    return procedimentosAgregados;
  };

  const getMediaProcedimentosPorPeriodo = (procedimentosPorPeriodo) => {
    const somaProcedimentos = procedimentosPorPeriodo
      .reduce((acc, { procedimentosPorUsuario }) => acc + procedimentosPorUsuario, 0);

    return somaProcedimentos / (procedimentosPorPeriodo.length);
  };

  const getOpcoesGraficoProcedimentoPorTempo = (procedimentos) => {
    const periodosSelecionados = filtroPeriodoProcedimento
      .map(({ value }) => value);
    const procedimentosFiltrados = procedimentos.filter((item) =>
      item.estabelecimento === filtroEstabelecimentoProcedimento.value
      && periodosSelecionados.includes(item.periodo)
      && item.tempo_servico_descricao !== null
      && item.estabelecimento_linha_perfil === "Todos"
      && item.estabelecimento_linha_idade === "Todos"
    );
    const procedimentosAgregados = agregarPorTempoDeServico(procedimentosFiltrados);

    return {
      tooltip: {},
      xAxis: {
        type: 'category',
        data: procedimentosAgregados.map(({ tempoServico }) => tempoServico)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: procedimentosAgregados.map(({ procedimentosPorPeriodo }) =>
            getMediaProcedimentosPorPeriodo(procedimentosPorPeriodo)),
          type: 'bar',
          name: 'Média de procedimentos'
        }
      ]
    };
  };

  const getPropsFiltroCompetencia = (procedimentos, estadoFiltro, funcaoSetFiltro) => {
    const periodosSemDuplicadas = [];

    procedimentos.forEach(({ periodo, competencia }) => {
      const periodoEncontrado = periodosSemDuplicadas
        .find((item) => item.periodo === periodo);

      if (!periodoEncontrado) {
        periodosSemDuplicadas.push({ periodo, competencia });
      }
    });

    const periodosOrdenadosDesc = periodosSemDuplicadas
      .sort((a, b) => new Date(b.competencia) - new Date(a.competencia))
      .map(({ periodo }) => ({
        value: periodo,
        label: periodo
      }));

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Períodos: { children }
      </components.Control>
    );

    return {
      options: periodosOrdenadosDesc,
      defaultValue: estadoFiltro,
      selectedValue: estadoFiltro,
      onChange: (selected) => funcaoSetFiltro(selected),
      isMulti: true,
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

      { procedimentosPorEstabelecimento.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${procedimentosPorEstabelecimento
                .find((item) =>
                  item.estabelecimento === "Todos"
                  && item.estabelecimento_linha_perfil === "Todos"
                  && item.estabelecimento_linha_idade === "Todos"
                  && item.periodo === "Último período"
                )
                .nome_mes
                }` }
            />

            { getCardsProcedimentosPorEstabelecimento(procedimentosPorEstabelecimento) }
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      {/* <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { procedimentosPorEstabelecimento.length !== 0
        ? (
          <>
            <div className={ styles.Filtro }>
              <Select {
                ...getPropsFiltroEstabelecimento(
                  procedimentosPorEstabelecimento,
                  filtroEstabelecimentoHistorico,
                  setFiltroEstabelecimentoHistorico
                )
              } />
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoHistoricoTemporal(
                filtrarPorEstabelecimento(procedimentosPorEstabelecimento, filtroEstabelecimentoHistorico),
                "procedimentos_por_usuario",
                filtroEstabelecimentoHistorico.value
              ) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      } */}

      <GraficoInfo
        titulo="Procedimento por usuários x tempo do usuário no serviço"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { procedimentosPorTempoServico.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroEstabelecimento(
                    procedimentosPorTempoServico,
                    filtroEstabelecimentoProcedimento,
                    setFiltroEstabelecimentoProcedimento
                  )
                } />
              </div>

              <div className={ styles.Filtro }>
                <Select {
                  ...getPropsFiltroCompetencia(
                    procedimentosPorTempoServico.filter(({ periodo }) => periodo !== "Fev/23"),
                    filtroPeriodoProcedimento,
                    setFiltroPeriodoProcedimento
                  )
                } />
              </div>
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoProcedimentoPorTempo(
                procedimentosPorTempoServico
              ) }
              style={ { width: "100%", height: "70vh" } }
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      }
    </div>
  );
};

export default ProcedimentosPorUsuarios;
