import { GraficoInfo, TituloSmallTexto, Spinner } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback} from 'react';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAtendimentosAmbulatorioResumoUltimoMes, getAtendimentosTotal, getAtendidos } from '../../../requests/outros-raps';
import { CardsAmbulatorioUltimoMes, CardsAtendimentoPorOcupacaoUltimoMes } from '../../../components/CardsAmbulatorio';
import { getOpcoesGraficoAtendimentos } from '../../../helpers/graficoAtendimentos';
import {FiltroTexto} from '../../../components/Filtros';
import {FILTRO_ESTABELECIMENTO_DEFAULT} from '../../../constants/FILTROS';
export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Ambulatorio = () => {
  const { data: session } = useSession();
  const [atendimentosTotal, setAtendimentosTotal] = useState([]);
  const [atendidos, setAtendidos] = useState([]);
  const [atendimentosUltimoMes, setAtendimentosUltimoMes] = useState([]);
  const [filtroEstabelecimentoAtendimentosTotal, setFiltroEstabelecimentoAtendimentosTotal] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroEstabelecimentoAtendimentosPorHorasTrabalhadas, setFiltroEstabelecimentoAtendimentosPorHorasTrabalhadas] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendidos(await getAtendidos(municipioIdSus));
      setAtendimentosTotal(await getAtendimentosTotal(municipioIdSus));
      setAtendimentosUltimoMes(await getAtendimentosAmbulatorioResumoUltimoMes(municipioIdSus));
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

  obterAtendimentoGeralPorOcupacoes();
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
      />
    </div>
  );
};

export default Ambulatorio;
