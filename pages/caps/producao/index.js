import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { TabelaGraficoDonut } from '../../../components/Tabelas';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getProcedimentosPorHora, getProcedimentosPorTipo } from '../../../requests/caps';
import { ordenarCrescentePorPropriedadeDeTexto } from '../../../utils/ordenacao';
import styles from '../Caps.module.css';
import { ProcedimentosPorCaps } from '../../../components/ProcedimentosPorCaps';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import {FILTRO_PERIODO_MULTI_DEFAULT, FILTRO_PERIODO_DEFAULT, FILTRO_ESTABELECIMENTO_DEFAULT} from '../../../constants/FILTROS';
import { GraficoDonut } from '../../../components/Graficos';
import { GraficoBarrasProducao} from '../../../components/Graficos';
const OCUPACOES_NAO_ACEITAS = ['Todas', null];

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
  const procedimentosBPAFiltrados = useMemo(() => {
    const dadosFiltrados = filtrarPorTipoEstabelecimentoEPeriodo(
      procedimentosPorTipo,
      filtroEstabelecimentoBPA,
      filtroPeriodoBPA
    );

    return dadosFiltrados;
  }, [filtrarPorTipoEstabelecimentoEPeriodo, filtroEstabelecimentoBPA, filtroPeriodoBPA, procedimentosPorTipo]);

  const procedimentosRAASFiltrados = useMemo(() => {
    const dadosFiltrados = filtrarPorTipoEstabelecimentoEPeriodo(
      procedimentosPorTipo,
      filtroEstabelecimentoRAAS,
      filtroPeriodoRAAS
    );

    return dadosFiltrados;
  }, [filtrarPorTipoEstabelecimentoEPeriodo, filtroEstabelecimentoRAAS, filtroPeriodoRAAS, procedimentosPorTipo]);

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
                dados = {procedimentosPorHora}
                valor = {filtroPeriodoCBO}
                setValor = {setFiltroPeriodoCBO}
                isMulti = {false}
                label = {'Competência'}
              />
            </div>
            <GraficoBarrasProducao
              dados={filtrarPorHoraEstabelecimentoEPeriodo(procedimentosPorHora, filtroEstabelecimentoCBO, filtroPeriodoCBO)}
              textoTooltip={'Procedimentos por hora'}
              propriedades={{
                agregacao:'ocupacao',
                quantidade:'procedimentos_por_hora'
              }}
              loading={false}
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
                dados = {procedimentosPorTipo}
                valor = {filtroPeriodoBPA}
                setValor = {setFiltroPeriodoBPA}
                isMulti = {true}
                label = {'Competência'}
              />
            </div>

            <div className={ styles.GraficoCIDContainer }>
              <GraficoDonut
                dados={ procedimentosBPAFiltrados }
                propriedades={ {
                  nome: 'procedimento',
                  quantidade: 'procedimentos_registrados_bpa'
                } }
              />

              <TabelaGraficoDonut
                labels={ {
                  colunaHeader: 'Nome do procedimento',
                  colunaQuantidade: 'Quantidade registrada',
                } }
                propriedades={ {
                  nome: 'procedimento',
                  quantidade: 'procedimentos_registrados_bpa'
                } }
                data={ procedimentosBPAFiltrados }
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
                dados = {procedimentosPorTipo}
                valor = {filtroPeriodoRAAS}
                setValor = {setFiltroPeriodoRAAS}
                isMulti = {true}
                label = {'Competência'}
              />
            </div>

            <div className={ styles.GraficoCIDContainer }>
              <GraficoDonut
                dados={ procedimentosRAASFiltrados }
                propriedades={ {
                  nome: 'procedimento',
                  quantidade: 'procedimentos_registrados_raas'
                } }
              />

              <TabelaGraficoDonut
                labels={ {
                  colunaHeader: 'Nome do procedimento',
                  colunaQuantidade: 'Quantidade registrada',
                } }
                propriedades={ {
                  nome: 'procedimento',
                  quantidade: 'procedimentos_registrados_raas'
                } }
                data={ procedimentosRAASFiltrados }
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
                dados = {procedimentosPorTipo}
                valor = {filtroPeriodoProducao}
                setValor = {setFiltroPeriodoProducao}
                isMulti = {true}
                label = {'Competência'}
              />
            </div>
            <GraficoBarrasProducao
              dados={filtrarPorTipoEstabelecimentoEPeriodo(procedimentosPorTipo, filtroEstabelecimentoProducao, filtroPeriodoProducao)}
              textoTooltip={'Quantidade registrada'}
              propriedades={{
                agregacao:'procedimento',
                quantidade:'procedimentos_registrados_total'
              }}
              loading={false}
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
