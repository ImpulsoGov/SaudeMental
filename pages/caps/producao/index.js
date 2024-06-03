import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import { GraficoBarrasProducao, GraficoDonut } from '../../../components/Graficos';
import ProcedimentosPorCaps from '../../../components/ProcedimentosPorCaps/ProcedimentosPorCaps';
import { TabelaGraficoDonut } from '../../../components/Tabelas';
import { FILTRO_ESTABELECIMENTO_DEFAULT, FILTRO_PERIODO_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getEstabelecimentos, getPeriodos, obterNomesDeProcedimentosPorTipo, obterProcedimentosPorHora, obterProcedimentosPorTipo } from '../../../requests/caps';
import { ordenarCrescentePorPropriedadeDeTexto } from '../../../utils/ordenacao';
import styles from '../Caps.module.css';
import { getTextoCardsZerados } from '../../../utils/getTextoCardsZerados';
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
  const [estabelecimentosPorHora, setEstabelecimentosPorHora] = useState([]);
  const [periodosPorHora, setPeriodosPorHora] = useState([]);
  const [procedimentosPorHoraUltimoPeriodo, setProcedimentosPorHoraUltimoPeriodo] = useState([]);
  const [estabelecimentosPorTipo, setEstabelecimentosPorTipo] = useState([]);
  const [periodosPorTipo, setPeriodosPorTipo] = useState([]);
  const [nomesProcedimentosPorTipo, setNomesProcedimentosPorTipo] = useState([]);
  const [procedimentosBPA, setProcedimentosBPA] = useState([]);
  const [procedimentosRAAS, setProcedimentosRAAS] = useState([]);
  const [loadingBPA, setLoadingBPA] = useState(true);
  const [loadingRAAS, setLoadingRAAS] = useState(true);
  const [loadingProducao, setLoadingProducao] = useState(true);
  const [loadingProcedimentosPorHora, setLoadingProcedimentosPorHora] = useState(true);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setEstabelecimentosPorHora(await getEstabelecimentos(municipioIdSus, 'procedimentos_por_hora'));
      setPeriodosPorHora(await getPeriodos(municipioIdSus, 'procedimentos_por_hora'));
      setEstabelecimentosPorTipo(await getEstabelecimentos(municipioIdSus, 'procedimentos_por_tipo'));
      setPeriodosPorTipo(await getPeriodos(municipioIdSus, 'procedimentos_por_tipo'));
      setNomesProcedimentosPorTipo(await obterNomesDeProcedimentosPorTipo(municipioIdSus));
      setProcedimentosPorHoraUltimoPeriodo(await obterProcedimentosPorHora({
        municipioIdSus, periodos: 'Último período', ocupacao: 'Todas'
      }));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, [session?.user.municipio_id_ibge]);

  // prcedimentos por hora
  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingProcedimentosPorHora(true);

      obterProcedimentosPorHora({
        municipioIdSus: session?.user.municipio_id_ibge,
        estabelecimentos: filtroEstabelecimentoCBO.value,
        periodos: filtroPeriodoCBO.value
      }).then((resposta) => setProcedimentosPorHora(resposta));

      setLoadingProcedimentosPorHora(false);
    }
  }, [
    session?.user.municipio_id_ibge,
    filtroEstabelecimentoCBO.value,
    filtroPeriodoCBO.value
  ]);

  // procedimentos BPA
  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingBPA(true);

      const promises = filtroPeriodoBPA.map(({ value: periodo }) => {
        return obterProcedimentosPorTipo({
          municipioIdSus: session?.user.municipio_id_ibge,
          estabelecimentos: filtroEstabelecimentoBPA.value,
          periodos: periodo
        });
      });

      Promise.all(promises).then((respostas) => {
        const respostasUnificadas = [].concat(...respostas);
        setProcedimentosBPA(respostasUnificadas);
      });

      setLoadingBPA(false);
    }
  }, [
    session?.user.municipio_id_ibge,
    filtroEstabelecimentoBPA.value,
    filtroPeriodoBPA
  ]);

  // procedimentos RAAS
  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingRAAS(true);

      const promises = filtroPeriodoRAAS.map(({ value: periodo }) => {
        return obterProcedimentosPorTipo({
          municipioIdSus: session?.user.municipio_id_ibge,
          estabelecimentos: filtroEstabelecimentoRAAS.value,
          periodos: periodo
        });
      });

      Promise.all(promises).then((respostas) => {
        const respostasUnificadas = [].concat(...respostas);
        setProcedimentosRAAS(respostasUnificadas);
      });

      setLoadingRAAS(false);
    }
  }, [
    session?.user.municipio_id_ibge,
    filtroEstabelecimentoRAAS.value,
    filtroPeriodoRAAS
  ]);

  // procedimentos por tipo (gráfico de produção)
  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingProducao(true);

      const promises = filtroPeriodoProducao.map(({ value: periodo }) => {
        return obterProcedimentosPorTipo({
          municipioIdSus: session?.user.municipio_id_ibge,
          estabelecimentos: filtroEstabelecimentoProducao.value,
          periodos: periodo
        });
      });

      Promise.all(promises).then((respostas) => {
        const respostasUnificadas = [].concat(...respostas);
        setProcedimentosPorTipo(respostasUnificadas);
      });

      setLoadingProducao(false);
    }
  }, [
    session?.user.municipio_id_ibge,
    filtroEstabelecimentoProducao.value,
    filtroPeriodoProducao
  ]);

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
  const verificaCardsZerados = (procedimentos) => {
    return procedimentos.some((procedimento =>
      procedimento.procedimentos_por_hora !== null &&
      procedimento.procedimentos_por_hora !== undefined
    ));
  };
  const getCardsProcedimentosHoraPorEstabelecimento = (procedimentos) => {
    const procedimentosFiltrados = procedimentos
      .filter(({
        estabelecimento,
        estabelecimento_linha_perfil: linhaPerfil,
        procedimentos_por_hora: procedimentosPorHora
      }) =>
        estabelecimento !== 'Todos'
        && linhaPerfil !== 'Todos'
        && procedimentosPorHora !== null
      );

    const procedimentosAgregados = agregarPorLinhaPerfil(procedimentosFiltrados);

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

  const procedimentosPorHoraValidos = useMemo(() => {
    return procedimentosPorHora.filter((item) =>
      !OCUPACOES_NAO_ACEITAS.includes(item.ocupacao)
      && item.procedimentos_por_hora !== null
    );
  }, [procedimentosPorHora]);
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
        titulo="<strong>Produção</strong>"
      />

      <GraficoInfo
        fonte='Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { procedimentosPorHoraUltimoPeriodo.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${procedimentosPorHoraUltimoPeriodo
                .find((item) => item.estabelecimento === 'Todos')
                .nome_mes
                }` }
            />

            { verificaCardsZerados(procedimentosPorHoraUltimoPeriodo) ? getCardsProcedimentosHoraPorEstabelecimento(procedimentosPorHoraUltimoPeriodo) : getTextoCardsZerados() }
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Produção por hora de trabalho por CBO'
        descricao='Normalizado por horas de trabalho'
        fonte='Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      <div className={ styles.Filtros }>
        <FiltroTexto
          width={ '50%' }
          dados={ estabelecimentosPorHora }
          valor={ filtroEstabelecimentoCBO }
          setValor={ setFiltroEstabelecimentoCBO }
          label={ 'Estabelecimento' }
          propriedade={ 'estabelecimento' }
        />
        <FiltroCompetencia
          width={ '50%' }
          dados={ periodosPorHora }
          valor={ filtroPeriodoCBO }
          setValor={ setFiltroPeriodoCBO }
          isMulti={ false }
          label={ 'Competência' }
        />
      </div>

      <GraficoBarrasProducao
        dados={ procedimentosPorHoraValidos }
        textoTooltip={ 'Procedimentos por hora' }
        propriedades={ {
          agregacao: 'ocupacao',
          quantidade: 'procedimentos_por_hora'
        } }
        loading={ loadingProcedimentosPorHora }
      />

      <GraficoInfo
        titulo='Procedimentos BPA'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />

      <div className={ styles.Filtros }>
        <FiltroTexto
          width={ '50%' }
          dados={ estabelecimentosPorTipo }
          valor={ filtroEstabelecimentoBPA }
          setValor={ setFiltroEstabelecimentoBPA }
          label={ 'Estabelecimento' }
          propriedade={ 'estabelecimento' }
        />

        <FiltroCompetencia
          width={ '50%' }
          dados={ periodosPorTipo }
          valor={ filtroPeriodoBPA }
          setValor={ setFiltroPeriodoBPA }
          isMulti={ true }
          label={ 'Competência' }
        />
      </div>

      { loadingBPA
        ? <Spinner theme='ColorSM' />
        : <div className={ styles.GraficoCIDContainer }>
          <GraficoDonut
            dados={ procedimentosBPA }
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
            data={ procedimentosBPA }
            mensagemDadosZerados='Sem procedimentos registrados nessa competência'
          />
        </div>
      }

      <GraficoInfo
        titulo='Procedimentos RAAS'
        fonte='Fonte: RAAS/SIASUS - Elaboração Impulso Gov'
      />

      <div className={ styles.Filtros }>
        <FiltroTexto
          width={ '50%' }
          dados={ estabelecimentosPorTipo }
          valor={ filtroEstabelecimentoRAAS }
          setValor={ setFiltroEstabelecimentoRAAS }
          label={ 'Estabelecimento' }
          propriedade={ 'estabelecimento' }
        />

        <FiltroCompetencia
          width={ '50%' }
          dados={ periodosPorTipo }
          valor={ filtroPeriodoRAAS }
          setValor={ setFiltroPeriodoRAAS }
          isMulti={ true }
          label={ 'Competência' }
        />
      </div>

      { loadingRAAS
        ? <Spinner theme='ColorSM' />
        : <div className={ styles.GraficoCIDContainer }>
          <GraficoDonut
            dados={ procedimentosRAAS }
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
            data={ procedimentosRAAS }
            mensagemDadosZerados='Sem procedimentos registrados nessa competência'
          />
        </div>
      }

      <GraficoInfo
        titulo='Produção'
        fonte='Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      <div className={ styles.Filtros }>
        <FiltroTexto
          width={ '50%' }
          dados={ estabelecimentosPorTipo }
          valor={ filtroEstabelecimentoProducao }
          setValor={ setFiltroEstabelecimentoProducao }
          label={ 'Estabelecimento' }
          propriedade={ 'estabelecimento' }
        />

        <FiltroCompetencia
          width={ '50%' }
          dados={ periodosPorTipo }
          valor={ filtroPeriodoProducao }
          setValor={ setFiltroPeriodoProducao }
          isMulti={ true }
          label={ 'Competência' }
        />
      </div>

      <GraficoBarrasProducao
        dados={ procedimentosPorTipo }
        textoTooltip={ 'Quantidade registrada' }
        propriedades={ {
          agregacao: 'procedimento',
          quantidade: 'procedimentos_registrados_total'
        } }
        loading={ loadingProducao }
      />

      <GraficoInfo
        titulo='Procedimentos por CAPS'
        fonte='Fonte: BPA-c, BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      <ProcedimentosPorCaps
        municipioIdSus={ session?.user.municipio_id_ibge }
        periodos={ periodosPorTipo }
        estabelecimentos={ estabelecimentosPorTipo }
        nomesProcedimentos={ nomesProcedimentosPorTipo }
        requisicao={ obterProcedimentosPorTipo }
      />
    </div>
  );
};

export default Producao;
