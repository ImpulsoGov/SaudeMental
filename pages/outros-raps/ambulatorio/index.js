import { GraficoInfo, TituloSmallTexto, Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback} from 'react';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAtendimentosAmbulatorioResumoUltimoMes, getAtendimentosPorProfissional, getAtendimentosTotal } from '../../../requests/outros-raps';
import { CardsAmbulatorioUltimoMes, CardsAtendimentoPorOcupacaoUltimoMes } from '../../../components/CardsAmbulatorio';
import { TabelaAtendimentosPorProfissional } from '../../../components/Tabelas';
import { getOpcoesGraficoAtendimentos } from '../../../helpers/graficoAtendimentos';
import {FiltroCompetencia, FiltroTexto} from '../../../components/Filtros';
import {FILTRO_ESTABELECIMENTO_DEFAULT, FILTRO_ESTABELECIMENTO_MULTI_DEFAULT} from '../../../constants/FILTROS';
import { FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import Style from '../OutrosRaps.module.css';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Ambulatorio = () => {
  const { data: session } = useSession();
  const [atendimentosTotal, setAtendimentosTotal] = useState([]);
  const [atendimentosUltimoMes, setAtendimentosUltimoMes] = useState([]);
  const [atendimentosPorProfissional, setAtendimentosPorProfissional] = useState([]);
  const [filtroEstabelecimentoAtendimentosTotal, setFiltroEstabelecimentoAtendimentosTotal] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroEstabelecimentoAtendimentosPorHorasTrabalhadas, setFiltroEstabelecimentoAtendimentosPorHorasTrabalhadas] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroEstabelecimentoAtendimentosPorProfissional, setFiltroEstabelecimentoAtendimentosPorProfissional] = useState(FILTRO_ESTABELECIMENTO_MULTI_DEFAULT);
  const [filtroCompetenciaAtendimentosPorProfissional, setFiltroCompetenciaAtendimentosPorProfissional] = useState(FILTRO_PERIODO_MULTI_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendimentosTotal(await getAtendimentosTotal(municipioIdSus));
      setAtendimentosUltimoMes(await getAtendimentosAmbulatorioResumoUltimoMes(municipioIdSus));
      setAtendimentosPorProfissional(await getAtendimentosPorProfissional(municipioIdSus));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const obterAtendimentoGeralUltimoMesPorOcupacao = useCallback((ocupacao) => {
    const atendimentoGeralPorOcupacao = atendimentosUltimoMes.find((atendimento) =>
      atendimento.ocupacao === ocupacao
      && atendimento.periodo === 'Último período'
      && atendimento.estabelecimento === 'Todos'
    );

    return atendimentoGeralPorOcupacao;
  }, [atendimentosUltimoMes]);
  const obterAtendimentoGeralPorOcupacoes = useCallback(() => {
    //todo: falar com taina sobre essa forma
    const atendimentosPorOcupacoes = atendimentosTotal.filter((atendimento) =>
      atendimento.ocupacao !== 'Todas'
    );
    return atendimentosPorOcupacoes;
  }, [atendimentosTotal]);

  const filtrarPorEstabelecimento = (dados, filtro) => {
    return dados.filter((item => item.estabelecimento === filtro.value));
  };
  const filtrarPorMultiplosEstabelecimentos = (dados, filtro) => {
    const estabelecimentos = filtro.map(({ value }) => value);
    return dados.filter((item => estabelecimentos.includes(item.estabelecimento)));
  };
  const filtrarPorPeriodo = (dados, filtro) => {
    const periodos = filtro.map(({ value }) => value);
    return dados.filter((item => periodos.includes(item.periodo)));
  };
  const agregarPorNomeEOcupacao = (dadosFiltrados) => {
    const dadosAgregados = [];
    dadosFiltrados.forEach((dado) => {
      const dadoEncontrado = dadosAgregados
        .find((item) => item.profissional_nome === dado.profissional_nome && item.ocupacao === dado.ocupacao);

      if (!dadoEncontrado) {
        dadosAgregados.push({
          profissional_nome: dado.profissional_nome,
          ocupacao: dado.ocupacao,
          atendimentos_por_hora: dado.procedimentos_por_hora? Number(dado.procedimentos_por_hora.toFixed(2)) : null,
          atendimentos_realizados: dado.procedimentos_realizados,
          id: dado.id
        });
      } else {
        dadoEncontrado.atendimentos_por_hora += dado.procedimentos_por_hora;
        dadoEncontrado.atendimentos_realizados += dado.procedimentos_realizados;
      }
    });
    return dadosAgregados;
  };

  function filtrarDados(dados){
    const filtradosPorEstabelecimento = filtrarPorMultiplosEstabelecimentos(dados, filtroEstabelecimentoAtendimentosPorProfissional);
    const filtradosPorPeriodoEEstabelecimento = filtrarPorPeriodo(filtradosPorEstabelecimento, filtroCompetenciaAtendimentosPorProfissional);
    return filtradosPorPeriodoEEstabelecimento;
  }
  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=''
        botao={{
          label: '',
          url: ''
        }}
        titulo='<strong>Ambulatório de Saúde Mental</strong>'
      />

      <GraficoInfo
        titulo='Ambulatório de Saúde Mental'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />

      <CardsAmbulatorioUltimoMes
        atendimento={
          obterAtendimentoGeralUltimoMesPorOcupacao('Todas')
        }
      />

      <GraficoInfo
        titulo='Atendimentos'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />

      <CardsAtendimentoPorOcupacaoUltimoMes
        atendimentoPsicologo={
          obterAtendimentoGeralUltimoMesPorOcupacao('Psicólogo clínico')
        }
        atendimentoPsiquiatra={
          obterAtendimentoGeralUltimoMesPorOcupacao('Médico psiquiatra')
        }
      />

      <GraficoInfo
        titulo='Total de atendimentos'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
        tooltip='Indicador é calculado a partir de divisão do total de procedimentos registradas pelo total de horas de trabalho estabelecidas em contrato. De tal modo, dados podem apresentar valores subestimados no caso de férias, licenças, feriados e números de finais de semana no mês.'
      />
      { atendimentosTotal.length !== 0
        ? (
          <>
            <FiltroTexto
              width ={'50%'}
              dados = {atendimentosTotal}
              valor = {filtroEstabelecimentoAtendimentosTotal}
              setValor = {setFiltroEstabelecimentoAtendimentosTotal}
              label = {'Estabelecimento'}
              propriedade = {'estabelecimento'}
            />
            <ReactEcharts
              option={
                getOpcoesGraficoAtendimentos(
                  filtrarPorEstabelecimento(obterAtendimentoGeralPorOcupacoes(), filtroEstabelecimentoAtendimentosTotal),
                  'procedimentos_realizados',
                  'Médico psiquiatra',
                  'Psicólogo clínico'
                )
              }
              style = {{width: '100%', height: '70vh'}}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }
      <GraficoInfo
        titulo='Atendimentos por horas trabalhadas'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
        tooltip='Indicador é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, números de maior número de finais de semana no mês.'
      />
      { atendimentosTotal.length !== 0
        ? (
          <>
            <FiltroTexto
              width ={'50%'}
              dados = {atendimentosTotal}
              valor = {filtroEstabelecimentoAtendimentosPorHorasTrabalhadas}
              setValor = {setFiltroEstabelecimentoAtendimentosPorHorasTrabalhadas}
              label = {'Estabelecimento'}
              propriedade = {'estabelecimento'}
            />
            <ReactEcharts
              option={
                getOpcoesGraficoAtendimentos(
                  filtrarPorEstabelecimento(obterAtendimentoGeralPorOcupacoes(), filtroEstabelecimentoAtendimentosPorHorasTrabalhadas),
                  'procedimentos_por_hora',
                  'Médico psiquiatra',
                  'Psicólogo clínico'
                )
              }
              style = {{width: '100%', height: '70vh'}}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }
      <GraficoInfo
        titulo='Pirâmide etária de atendidos'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />

      <GraficoInfo
        titulo='Atendimentos por profissional'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
        tooltip='O indicador de atendimentos por hora é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, números de maior número de finais de semana no mês.'
      />
      { atendimentosTotal.length !== 0
        ? (
          <> <div className = {Style.Filtros}>
            <FiltroTexto
              width ={'50%'}
              dados = {atendimentosPorProfissional}
              valor = {filtroEstabelecimentoAtendimentosPorProfissional}
              setValor = {setFiltroEstabelecimentoAtendimentosPorProfissional}
              label = {'Estabelecimento'}
              propriedade = {'estabelecimento'}
              isMulti
              showAllOption
              isDefaultAllOption
            />
            <FiltroCompetencia
              width ={'50%'}
              dados = {atendimentosPorProfissional}
              valor = {filtroCompetenciaAtendimentosPorProfissional}
              setValor = {setFiltroCompetenciaAtendimentosPorProfissional}
              label = {'Competência'}
              isMulti
              showAllOption
              isDefaultAllOption
            />
          </div>
          <TabelaAtendimentosPorProfissional
            atendimentos={ agregarPorNomeEOcupacao(filtrarDados(atendimentosPorProfissional)) }
          />
          </>
        )
        : <Spinner theme='ColorSM' />
      }
    </div>
  );
};

export default Ambulatorio;
