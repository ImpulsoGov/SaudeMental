import { GraficoInfo, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAtendimentosAmbulatorioResumoUltimoMes, getAtendimentosPorProfissional } from '../../../requests/outros-raps';
import { CardsAmbulatorioUltimoMes, CardsAtendimentoPorOcupacaoUltimoMes } from '../../../components/CardsAmbulatorio';
import { TabelaAtendimentosPorProfissional } from '../../../components/Tabelas';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Ambulatorio = () => {
  const { data: session } = useSession();
  const [atendimentosUltimoMes, setAtendimentosUltimoMes] = useState([]);
  const [atendimentosPorProfissional, setAtendimentosPorProfissional] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
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

      <GraficoInfo
        titulo='Atendimentos por horas trabalhadas'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
        tooltip='Indicador é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, números de maior número de finais de semana no mês.'
      />

      <GraficoInfo
        titulo='Pirâmide etária de atendidos'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />

      <GraficoInfo
        titulo='Atendimentos por profissional'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />

      <TabelaAtendimentosPorProfissional
        atendimentos={ atendimentosPorProfissional }
      />
    </div>
  );
};

export default Ambulatorio;
