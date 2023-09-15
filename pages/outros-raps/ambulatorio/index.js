import { GraficoInfo, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAtendimentosAmbulatorioResumoUltimoMes, getPerfilAtendimentosAmbulatorio } from '../../../requests/outros-raps';
import { CardsAmbulatorioUltimoMes, CardsAtendimentoPorOcupacaoUltimoMes } from '../../../components/CardsAmbulatorio';
import { FILTRO_ESTABELECIMENTO_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import ReactEcharts from 'echarts-for-react';
import styles from '../OutrosRaps.module.css';
import { agregarPorFaixaEtariaEGenero, getOpcoesGraficoGeneroEFaixaEtaria } from '../../../helpers/graficoGeneroEFaixaEtaria';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Ambulatorio = () => {
  const { data: session } = useSession();
  const [atendimentosUltimoMes, setAtendimentosUltimoMes] = useState([]);
  const [perfilAtendimentos, setPerfilAtendimentos] = useState([]);
  const [filtroEstabelecimentoPiramideEtaria, setFiltroEstabelecimentoPiramideEtaria] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoPiramideEtaria, setFiltroPeriodoPiramideEtaria] = useState(FILTRO_PERIODO_MULTI_DEFAULT);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendimentosUltimoMes(await getAtendimentosAmbulatorioResumoUltimoMes(municipioIdSus));
      setPerfilAtendimentos(await getPerfilAtendimentosAmbulatorio(municipioIdSus));
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

  const agregadosPorGeneroEFaixaEtaria = useMemo(() => {
    const periodosSelecionados = filtroPeriodoPiramideEtaria.map(({ value }) => value);
    const atendimentosFiltrados = perfilAtendimentos.filter((atendimento) =>
      atendimento.estabelecimento === filtroEstabelecimentoPiramideEtaria.value
      && periodosSelecionados.includes(atendimento.periodo)
    );

    return agregarPorFaixaEtariaEGenero(
      atendimentosFiltrados,
      'usuario_faixa_etaria',
      'usuario_sexo',
      'usuarios_unicos_mes'
    );
  }, [perfilAtendimentos, filtroPeriodoPiramideEtaria, filtroEstabelecimentoPiramideEtaria.value]);

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

      {perfilAtendimentos.length !== 0
        ? <>
          <div className={ styles.Filtros }>
            <FiltroTexto
              dados={ perfilAtendimentos }
              label='Estabelecimento'
              propriedade='estabelecimento'
              valor={ filtroEstabelecimentoPiramideEtaria }
              setValor={ setFiltroEstabelecimentoPiramideEtaria }
            />

            <FiltroCompetencia
              dados={ perfilAtendimentos }
              valor={ filtroPeriodoPiramideEtaria }
              setValor={ setFiltroPeriodoPiramideEtaria }
              label='Competência'
              isMulti
            />
          </div>

          <ReactEcharts
            option={ getOpcoesGraficoGeneroEFaixaEtaria(
              agregadosPorGeneroEFaixaEtaria,
              'Nº de usuários únicos nas referências ambulatoriais'
            ) }
            style={ { width: '100%', height: '70vh' } }
          />
        </>
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Atendimentos por profissional'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />
    </div>
  );
};

export default Ambulatorio;
