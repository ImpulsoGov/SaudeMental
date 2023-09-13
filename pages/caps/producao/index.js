import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';
import { TabelaGraficoDonut } from '../../../components/Tabelas';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { agregarPorPropriedadeESomarQuantidade, getOpcoesGraficoBarrasProducao } from '../../../helpers/graficoBarrasProducao';
import { agregarQuantidadePorPropriedadeNome, getOpcoesGraficoDonut } from '../../../helpers/graficoDonut';
import { getProcedimentosPorHora, getProcedimentosPorTipo } from '../../../requests/caps';
import { ordenarCrescentePorPropriedadeDeTexto, ordenarDecrescentePorPropriedadeNumerica } from '../../../utils/ordenacao';
import styles from '../Caps.module.css';
import { ProcedimentosPorCaps } from '../../../components/ProcedimentosPorCaps';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import {FILTRO_PERIODO_MULTI_DEFAULT, FILTRO_PERIODO_DEFAULT, FILTRO_ESTABELECIMENTO_DEFAULT} from '../../../constants/FILTROS';

const OCUPACOES_NAO_ACEITAS = ['Todas', null];
const COMPETENCIA_MARCO_2022 = ['Mar/22'];
const COMPPETENCIAS_A_REMOVER = [...COMPETENCIA_MARCO_2022, 'Abr/22', 'Mai/22', 'Jun/22', 'Jul/22', 'Nov/22', 'Fev/23'];

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
  const [filtroPeriodoCBO, setFiltroPeriodoCBO] = useState(FILTRO_PERIODO_DEFAULT);
  const [filtroEstabelecimentoBPA, setFiltroEstabelecimentoBPA] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoBPA, setFiltroPeriodoBPA] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoRAAS, setFiltroEstabelecimentoRAAS] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoRAAS, setFiltroPeriodoRAAS] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoProducao, setFiltroEstabelecimentoProducao] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoProducao, setFiltroPeriodoProducao] = useState(FILTRO_PERIODO_MULTI_DEFAULT);

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
        periodo === 'Último período'
        && estabelecimento !== 'Todos'
        && linhaPerfil !== 'Todos'
        && procedimentosPorHora !== null
        && ocupacao === 'Todas'
        && linhaIdade === 'Todos'
      );

    const procedimentosAgregados = agregarPorLinhaPerfil(procedimentosPorHoraUltimoPeriodo);

    const cardsProcedimentosHoraPorEstabelecimento = procedimentosAgregados.map(({
      linhaPerfil, procedimentosPorEstabelecimento, nomeMes
    }) => {
      const procedimentosOrdenados = ordenarCrescentePorPropriedadeDeTexto(
        procedimentosPorEstabelecimento,
        'estabelecimento'
      );

      return (
        <>
          <GraficoInfo
            titulo={ `CAPS ${linhaPerfil}` }
            descricao='Comparativo de produção por hora de trabalho dos profissionais nos CAPS'
            fonte={ `Dados de ${nomeMes}` }
            tooltip='Indicador é calculado a partir da divisão do total de procedimentos registrados pelo total de horas de trabalho estabelecidas em contrato. De tal modo, dados podem apresentar valores subestimados no caso de férias, licenças, feriados e números de finais de semana no mês.'
          />

          <Grid12Col
            items={
              procedimentosOrdenados.map((item) => (
                <CardInfoTipoA
                  titulo={ item.estabelecimento }
                  indicador={ item.procedimentosPorHora }
                  indicadorDescricao='procedimentos/hora'
                  indice={ item.porcentagemDifProcedimentosPorHoraAnterior }
                  indiceSimbolo='%'
                  indiceDescricao='últ. mês'
                  key={ uuidv1() }
                />
              ))
            }
            proporcao='3-3-3-3'
          />
        </>
      );
    });

    return cardsProcedimentosHoraPorEstabelecimento;
  };

  const getValoresPeriodosSelecionados = (periodosSelecionados) => {
    return periodosSelecionados.map(({ value }) => value);
  };

  const filtrarPorHoraEstabelecimentoEPeriodo = (procedimentos, filtroEstabelecimento, filtroPeriodo) => {
    return procedimentos.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && item.periodo === filtroPeriodo.value
      && !OCUPACOES_NAO_ACEITAS.includes(item.ocupacao)
      && item.procedimentos_por_hora !== null
      && item.estabelecimento_linha_perfil === 'Todos'
      && item.estabelecimento_linha_idade === 'Todos'
    );
  };

  const filtrarPorTipoEstabelecimentoEPeriodo = useCallback((procedimentos, filtroEstabelecimento, filtroPeriodo) => {
    const periodosSelecionados = getValoresPeriodosSelecionados(filtroPeriodo);

    return procedimentos.filter((item) =>
      item.estabelecimento === filtroEstabelecimento.value
      && periodosSelecionados.includes(item.periodo)
      && item.estabelecimento_linha_perfil === 'Todos'
      && item.estabelecimento_linha_idade === 'Todos'
    );
  }, []);

  const agregadosPorCBO = agregarPorPropriedadeESomarQuantidade(
    filtrarPorHoraEstabelecimentoEPeriodo(procedimentosPorHora, filtroEstabelecimentoCBO, filtroPeriodoCBO),
    'ocupacao',
    'procedimentos_por_hora'
  );

  const agregadosPorProducao = agregarPorPropriedadeESomarQuantidade(
    filtrarPorTipoEstabelecimentoEPeriodo(procedimentosPorTipo, filtroEstabelecimentoProducao, filtroPeriodoProducao),
    'procedimento',
    'procedimentos_registrados_total'
  );

  const agrupadosPorTipoBPA = useMemo(() => {
    const dadosFiltrados = filtrarPorTipoEstabelecimentoEPeriodo(
      procedimentosPorTipo,
      filtroEstabelecimentoBPA,
      filtroPeriodoBPA
    );
    const dadosAgregados = agregarQuantidadePorPropriedadeNome(dadosFiltrados, 'procedimento', 'procedimentos_registrados_bpa');
    const dadosNaoZerados = dadosAgregados.filter(({ quantidade }) => quantidade !== 0);
    const dadosOrdenados = ordenarDecrescentePorPropriedadeNumerica(dadosNaoZerados, 'quantidade');

    return dadosOrdenados;
  }, [filtrarPorTipoEstabelecimentoEPeriodo, filtroEstabelecimentoBPA, filtroPeriodoBPA, procedimentosPorTipo]);

  const agrupadosPorTipoRAAS = useMemo(() => {
    const dadosFiltrados = filtrarPorTipoEstabelecimentoEPeriodo(
      procedimentosPorTipo,
      filtroEstabelecimentoRAAS,
      filtroPeriodoRAAS
    );
    const dadosAgregados = agregarQuantidadePorPropriedadeNome(dadosFiltrados, 'procedimento', 'procedimentos_registrados_raas');
    const dadosNaoZerados = dadosAgregados.filter(({ quantidade }) => quantidade !== 0);
    const dadosOrdenados = ordenarDecrescentePorPropriedadeNumerica(dadosNaoZerados, 'quantidade');

    return dadosOrdenados;
  }, [filtrarPorTipoEstabelecimentoEPeriodo, filtroEstabelecimentoRAAS, filtroPeriodoRAAS, procedimentosPorTipo]);

  const removerCompetencias = (dados, competencias) => {
    return dados.filter(({ periodo }) => !competencias.includes(periodo));
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        botao={{
          label: '',
          url: ''
        }}
        titulo="<strong>Produção</strong>"
      />

      <GraficoInfo
        fonte='Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { procedimentosPorHora.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${procedimentosPorHora
                .find((item) =>
                  item.estabelecimento === 'Todos'
                  && item.estabelecimento_linha_perfil === 'Todos'
                  && item.estabelecimento_linha_idade === 'Todos'
                  && item.periodo === 'Último período'
                )
                .nome_mes
              }` }
            />

            { getCardsProcedimentosHoraPorEstabelecimento(procedimentosPorHora) }
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Produção por hora de trabalho por CBO'
        descricao='Normalizado por horas de trabalho'
        fonte='Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { procedimentosPorHora.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {procedimentosPorHora}
                valor = {filtroEstabelecimentoCBO}
                setValor = {setFiltroEstabelecimentoCBO}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {removerCompetencias(procedimentosPorHora, COMPPETENCIAS_A_REMOVER)}
                valor = {filtroPeriodoCBO}
                setValor = {setFiltroPeriodoCBO}
                isMulti = {false}
                label = {'Competência'}
              />
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoBarrasProducao(
                agregadosPorCBO,
                'Procedimentos por hora'
              ) }
              style={ { width: '100%', height: '70vh' } }
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Procedimentos BPA'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />

      { procedimentosPorTipo.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {procedimentosPorTipo}
                valor = {filtroEstabelecimentoBPA}
                setValor = {setFiltroEstabelecimentoBPA}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {removerCompetencias(procedimentosPorTipo, COMPPETENCIAS_A_REMOVER)}
                valor = {filtroPeriodoBPA}
                setValor = {setFiltroPeriodoBPA}
                isMulti = {true}
                label = {'Competência'}
              />
            </div>

            <div className={ styles.GraficoCIDContainer }>
              <ReactEcharts
                option={ getOpcoesGraficoDonut(agrupadosPorTipoBPA) }
                style={ { width: '50%', height: '70vh' } }
              />

              <TabelaGraficoDonut
                labels={ {
                  colunaHeader: 'Nome do procedimento',
                  colunaQuantidade: 'Quantidade registrada',
                } }
                data={ agrupadosPorTipoBPA }
                mensagemDadosZerados='Sem procedimentos registrados nessa competência'
              />
            </div>
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Procedimentos RAAS'
        fonte='Fonte: RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { procedimentosPorTipo.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {procedimentosPorTipo}
                valor = {filtroEstabelecimentoRAAS}
                setValor = {setFiltroEstabelecimentoRAAS}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {removerCompetencias(procedimentosPorTipo, COMPETENCIA_MARCO_2022)}
                valor = {filtroPeriodoRAAS}
                setValor = {setFiltroPeriodoRAAS}
                isMulti = {true}
                label = {'Competência'}
              />
            </div>

            <div className={ styles.GraficoCIDContainer }>
              <ReactEcharts
                option={ getOpcoesGraficoDonut(agrupadosPorTipoRAAS) }
                style={ { width: '50%', height: '70vh' } }
              />

              <TabelaGraficoDonut
                labels={ {
                  colunaHeader: 'Nome do procedimento',
                  colunaQuantidade: 'Quantidade registrada',
                } }
                data={ agrupadosPorTipoRAAS }
                mensagemDadosZerados='Sem procedimentos registrados nessa competência'
              />
            </div>
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Produção'
        fonte='Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { procedimentosPorTipo.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {procedimentosPorTipo}
                valor = {filtroEstabelecimentoProducao}
                setValor = {setFiltroEstabelecimentoProducao}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {removerCompetencias(procedimentosPorTipo, COMPPETENCIAS_A_REMOVER)}
                valor = {filtroPeriodoProducao}
                setValor = {setFiltroPeriodoProducao}
                isMulti = {true}
                label = {'Competência'}
              />
            </div>

            <ReactEcharts
              option={ getOpcoesGraficoBarrasProducao(
                agregadosPorProducao,
                'Quantidade registrada'
              ) }
              style={ { width: '100%', height: '70vh' } }
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Procedimentos por CAPS'
        fonte='Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      {procedimentosPorTipo.length !== 0
        ? <ProcedimentosPorCaps
          procedimentos={ procedimentosPorTipo }
        />
        : <Spinner theme='ColorSM' />
      }
    </div>
  );
};

export default Producao;
