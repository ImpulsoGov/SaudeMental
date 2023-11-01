import { GraficoInfo, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAtendimentosAmbulatorioResumoUltimoMes, getPerfilAtendimentosAmbulatorio, getAtendimentosTotal } from '../../../requests/outros-raps';
import { CardsAmbulatorioUltimoMes, CardsAtendimentoPorOcupacaoUltimoMes } from '../../../components/CardsAmbulatorio';
import { FILTRO_ESTABELECIMENTO_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import styles from '../OutrosRaps.module.css';
import { mostrarMensagemSemAmbulatorio, mostrarMensagemSemDadosAmbulatorio } from '../../../helpers/mostrarDadosDeAmbulatorio';
import { GraficoAtendimentos, GraficoGeneroPorFaixaEtaria } from '../../../components/Graficos';
export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Ambulatorio = () => {
  const { data: session } = useSession();
  const [atendimentosTotal, setAtendimentosTotal] = useState([]);
  const [atendimentosUltimoMes, setAtendimentosUltimoMes] = useState([]);
  const [perfilAtendimentos, setPerfilAtendimentos] = useState([]);
  const [filtroEstabelecimentoPiramideEtaria, setFiltroEstabelecimentoPiramideEtaria] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoPiramideEtaria, setFiltroPeriodoPiramideEtaria] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoAtendimentosTotal, setFiltroEstabelecimentoAtendimentosTotal] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroEstabelecimentoAtendimentosPorHorasTrabalhadas, setFiltroEstabelecimentoAtendimentosPorHorasTrabalhadas] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);

  useEffect(() => {
    const mostraMensagemSemAmbulatorio = mostrarMensagemSemAmbulatorio(session?.user.municipio_id_ibge);
    const mostraMensagemSemDadosAmbulatorio = mostrarMensagemSemDadosAmbulatorio(session?.user.municipio_id_ibge);
    const getDados = async (municipioIdSus) => {
      setAtendimentosTotal(await getAtendimentosTotal(municipioIdSus));
      setAtendimentosUltimoMes(await getAtendimentosAmbulatorioResumoUltimoMes(municipioIdSus));
      setPerfilAtendimentos(await getPerfilAtendimentosAmbulatorio(municipioIdSus));
    };

    if (session?.user.municipio_id_ibge && !mostraMensagemSemAmbulatorio && !mostraMensagemSemDadosAmbulatorio) {
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

  const atendimentosFiltrados = useMemo(() => {
    const periodosSelecionados = filtroPeriodoPiramideEtaria.map(({ value }) => value);
    const filtrados = perfilAtendimentos.filter((atendimento) =>
      atendimento.estabelecimento === filtroEstabelecimentoPiramideEtaria.value
      && periodosSelecionados.includes(atendimento.periodo)
    );
    return filtrados;
  }, [perfilAtendimentos, filtroPeriodoPiramideEtaria, filtroEstabelecimentoPiramideEtaria.value]);

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

  if (mostrarMensagemSemAmbulatorio(session?.user.municipio_id_ibge)) {
    return (
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto='Essa página não está exibindo dados porque a coordenação da RAPS informou que não há ambulatórios da rede especializada que realizam atendimentos de Saúde Mental com psicólogos e psiquiatras em seu município. Caso queira solicitar a inclusão de um novo estabelecimento ambulatorial, entre em contato via nosso <u><a style="color:inherit" href="/duvidas" target="_blank">formulário de solicitação de suporte</a></u>, <u><a style="color:inherit" href="https://wa.me/5511941350260" target="_blank">whatsapp</a></u> ou e-mail (saudemental@impulsogov.org).'
        botao={{
          label: '',
          url: ''
        }}
      />
    );
  }

  if (mostrarMensagemSemDadosAmbulatorio(session?.user.municipio_id_ibge)) {
    return (
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto='O indicador de ambulatório utiliza dados da atenção especializada que são coletados através dos registros de psicólogos e psiquiatras em fichas de BPA-i. São considerados os estabelecimentos indicados no momento do preenchimento do Formulário de Personalização do Painel, feito pela coordenação da RAPS no município.
        <br/>
        Se essa página não está exibindo nenhum dado da sua rede, verifique se o estabelecimento está habilitado a registrar em BPA-i (como no caso de ambulatórios vinculados a Atenção Básica que registram via SISAB), ou se existem problemas de registro.'
        botao={{
          label: '',
          url: ''
        }}
      />
    );
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
            <GraficoAtendimentos
              dados = {filtrarPorEstabelecimento(obterAtendimentoGeralPorOcupacoes(), filtroEstabelecimentoAtendimentosTotal)}
              textoTooltipA={'Médico psiquiatra'}
              textoTooltipB={'Psicólogo clínico'}
              loading = {false}
              propriedade={'procedimentos_realizados'}
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
            <GraficoAtendimentos
              dados = {filtrarPorEstabelecimento(obterAtendimentoGeralPorOcupacoes(), filtroEstabelecimentoAtendimentosPorHorasTrabalhadas)}
              textoTooltipA={'Médico psiquiatra'}
              textoTooltipB={'Psicólogo clínico'}
              loading = {false}
              propriedade={'procedimentos_por_hora'}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }
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
          <GraficoGeneroPorFaixaEtaria
            dados = {atendimentosFiltrados}
            labels={{
              eixoY: 'Nº de usuários únicos nas referências ambulatoriais'
            }}
            loading = {false}
            propriedades={{
              faixaEtaria: 'usuario_faixa_etaria',
              sexo: 'usuario_sexo',
              quantidade: 'usuarios_unicos_mes',
            }}

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
