import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import { FILTRO_ESTABELECIMENTO_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getOpcoesGraficoHistoricoTemporal } from "../../../helpers/graficoHistoricoTemporal";
import { getEstabelecimentos, getPeriodos, getProcedimentosPorEstabelecimento, obterProcedimentosPorTempoServico } from "../../../requests/caps";
import { ordenarCrescentePorPropriedadeDeTexto } from "../../../utils/ordenacao";
import styles from "../Caps.module.css";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ProcedimentosPorUsuarios = () => {
  const { data: session } = useSession();
  const [procedimentosPorEstabelecimento, setProcedimentosPorEstabelecimento] = useState([]);
  const [procedimentosPorTempoServico, setProcedimentosPorTempoServico] = useState([]);
  const [filtroEstabelecimentoProcedimento, setFiltroEstabelecimentoProcedimento] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoProcedimento, setFiltroPeriodoProcedimento] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [loadingProcedimentosPorTempoServico, setLoadingProcedimentosPorTempoServico] = useState(false);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setProcedimentosPorEstabelecimento(await getProcedimentosPorEstabelecimento(municipioIdSus));
      setEstabelecimentos(await getEstabelecimentos(
        municipioIdSus,
        "procedimentos_usuarios_tempo_servico"
      ));
      setPeriodos(await getPeriodos(
        municipioIdSus,
        "procedimentos_usuarios_tempo_servico"
      ));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingProcedimentosPorTempoServico(true);

      const promises = filtroPeriodoProcedimento.map(({ value: periodo }) => {
        return obterProcedimentosPorTempoServico(
          session?.user.municipio_id_ibge,
          filtroEstabelecimentoProcedimento.value,
          periodo
        );
      });

      Promise.all(promises).then((respostas) => {
        const respostasUnificadas = [].concat(...respostas);
        setProcedimentosPorTempoServico(respostasUnificadas);
      });

      setLoadingProcedimentosPorTempoServico(false);
    }
  }, [
    session?.user.municipio_id_ibge,
    filtroEstabelecimentoProcedimento.value,
    filtroPeriodoProcedimento
  ]);

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
    }) => {
      const procedimentosOrdenados = ordenarCrescentePorPropriedadeDeTexto(
        procedimentosPorEstabelecimento,
        "estabelecimento"
      );

      return (
        <>
          <GraficoInfo
            titulo={ `CAPS ${linhaPerfil}` }
            descricao={ `Dados de ${nomeMes}` }
          />

          <Grid12Col
            items={
              procedimentosOrdenados.map((item) => (
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
      );
    });

    return cardsProcedimentosPorEstabelecimento;
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
    const procedimentosFiltrados = procedimentos.filter((item) =>
      item.tempo_servico_descricao !== null
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

  const filtrarPorEstabelecimento = (dados, filtroEstabelecimento) => {
    return dados
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento.value
        && item.estabelecimento_linha_perfil === "Todos"
        && item.estabelecimento_linha_idade === "Todos"
      );
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        botao={ {
          label: '',
          url: ''
        } }
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

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />
      { procedimentosPorEstabelecimento.length !== 0
        ? (
          <>
            <FiltroTexto
              width={ '50%' }
              dados={ procedimentosPorEstabelecimento }
              valor={ filtroEstabelecimentoHistorico }
              setValor={ setFiltroEstabelecimentoHistorico }
              label={ 'Estabelecimento' }
              propriedade={ 'estabelecimento' }
            />

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
      }

      <GraficoInfo
        titulo="Procedimento por usuários x tempo do usuário no serviço"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { procedimentosPorTempoServico.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={ '50%' }
                dados={ estabelecimentos }
                valor={ filtroEstabelecimentoProcedimento }
                setValor={ setFiltroEstabelecimentoProcedimento }
                label={ 'Estabelecimento' }
                propriedade={ 'estabelecimento' }
              />
              <FiltroCompetencia
                width={ '50%' }
                dados={ periodos }
                valor={ filtroPeriodoProcedimento }
                setValor={ setFiltroPeriodoProcedimento }
                isMulti
                label={ 'Competência' }
              />
            </div>

            { loadingProcedimentosPorTempoServico
              ? <Spinner theme="ColorSM" height="70vh" />
              : <ReactEcharts
                option={ getOpcoesGraficoProcedimentoPorTempo(
                  procedimentosPorTempoServico
                ) }
                style={ { width: "100%", height: "70vh" } }
              />
            }
          </>
        )
        : <Spinner theme="ColorSM" />
      }
    </div>
  );
};

export default ProcedimentosPorUsuarios;
