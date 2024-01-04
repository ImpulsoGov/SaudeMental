import { GraficoInfo, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CardsAmbulatorioUltimoMes, CardsAtendimentoPorOcupacaoUltimoMes } from '../../../components/CardsAmbulatorio';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import { GraficoAtendimentos, GraficoGeneroPorFaixaEtaria } from '../../../components/Graficos';
import { TabelaAtendimentosPorProfissional } from '../../../components/Tabelas';
import { FILTRO_ESTABELECIMENTO_DEFAULT, FILTRO_ESTABELECIMENTO_MULTI_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import { MUNICIPIOS_ID_SUS_SEM_AMBULATORIO, MUNICIPIOS_ID_SUS_SEM_DADOS_AMBULATORIO } from '../../../constants/MUNICIPIOS_SEM_OUTROS_SERVICOS.js';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getPeriodos } from '../../../requests/caps';
import { getAtendimentosAmbulatorioResumoUltimoMes, getAtendimentosPorProfissional, getAtendimentosTotal, getPerfilAtendimentosAmbulatorio } from '../../../requests/outros-raps';
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
  const [perfilAtendimentos, setPerfilAtendimentos] = useState([]);
  const [filtroEstabelecimentoPiramideEtaria, setFiltroEstabelecimentoPiramideEtaria] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoPiramideEtaria, setFiltroPeriodoPiramideEtaria] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [periodos, setPeriodos] = useState([]);
  const [loadingPiramideEtaria, setloadingPiramideEtaria] = useState(true);
  const municipioSemAmbulatorio = MUNICIPIOS_ID_SUS_SEM_AMBULATORIO.includes(session?.user.municipio_id_ibge);
  const municipioSemDadosAmbulatorio = MUNICIPIOS_ID_SUS_SEM_DADOS_AMBULATORIO.includes(session?.user.municipio_id_ibge);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendimentosTotal(await getAtendimentosTotal(municipioIdSus)); //atendimento_resumo
      setAtendimentosUltimoMes(await getAtendimentosAmbulatorioResumoUltimoMes(municipioIdSus));
      setAtendimentosPorProfissional(await getAtendimentosPorProfissional(municipioIdSus));
      setPeriodos(
        await getPeriodos(municipioIdSus, 'usuarios_perfil')
      );
      setPerfilAtendimentos(await getPerfilAtendimentosAmbulatorio({
        municipioIdSus,
        estabelecimentos: 'Todos',
        periodos: 'Último período'
      }));// usuario_perfil
    };

    if (session?.user.municipio_id_ibge && !municipioSemAmbulatorio && !municipioSemDadosAmbulatorio) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setloadingPiramideEtaria(true);
      const promises = filtroPeriodoPiramideEtaria.map(({ value: periodo }) => {
        return getPerfilAtendimentosAmbulatorio({
          municipioIdSus: session?.user.municipio_id_ibge,
          estabelecimentos: filtroEstabelecimentoPiramideEtaria.value,
          periodos: periodo
        });
      });

      Promise.all(promises).then((result) => {
        const respostasUnificadas = [].concat(...result);
        setPerfilAtendimentos(respostasUnificadas);
      });

      setloadingPiramideEtaria(false);
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoPiramideEtaria, filtroPeriodoPiramideEtaria]);

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
          atendimentos_por_hora: dado.procedimentos_por_hora ? Number(dado.procedimentos_por_hora.toFixed(2)) : null,
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

  function filtrarDados(dados) {
    const filtradosPorEstabelecimento = filtrarPorMultiplosEstabelecimentos(dados, filtroEstabelecimentoAtendimentosPorProfissional);
    const filtradosPorPeriodoEEstabelecimento = filtrarPorPeriodo(filtradosPorEstabelecimento, filtroCompetenciaAtendimentosPorProfissional);
    return filtradosPorPeriodoEEstabelecimento;
  }

  function ordenarPorNomeProfissional(atualAtendimento, proximoAtendimento) {
    if (!atualAtendimento.profissional_nome || !proximoAtendimento.profissional_nome) {
      return -1;
    }

    return atualAtendimento.profissional_nome.localeCompare(proximoAtendimento.profissional_nome);
  }

  function agregarFiltrarEOrdenar(dados) {
    const agregados = agregarPorNomeEOcupacao(filtrarDados(dados));

    return agregados.sort(ordenarPorNomeProfissional);
  }

  if (municipioSemAmbulatorio) {
    return (
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto='Essa página não está exibindo dados porque a coordenação da RAPS informou que não há ambulatórios da rede especializada que realizam atendimentos de Saúde Mental com psicólogos e psiquiatras em seu município. Caso queira solicitar a inclusão de um novo estabelecimento ambulatorial, entre em contato via nosso <u><a style="color:inherit" href="/duvidas" target="_blank">formulário de solicitação de suporte</a></u>, <u><a style="color:inherit" href="https://wa.me/5511942642429" target="_blank">whatsapp</a></u> ou e-mail (saudemental@impulsogov.org).'
        botao={ {
          label: '',
          url: ''
        } }
      />
    );
  }

  if (municipioSemDadosAmbulatorio) {
    return (
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto='O indicador de ambulatório utiliza dados da atenção especializada que são coletados através dos registros de psicólogos e psiquiatras em fichas de BPA-i. São considerados os estabelecimentos indicados no momento do preenchimento do Formulário de Personalização do Painel, feito pela coordenação da RAPS no município.
        <br/>
        Se essa página não está exibindo nenhum dado da sua rede, verifique se o estabelecimento está habilitado a registrar em BPA-i (como no caso de ambulatórios vinculados a Atenção Básica que registram via SISAB), ou se existem problemas de registro.'
        botao={ {
          label: '',
          url: ''
        } }
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
        botao={ {
          label: '',
          url: ''
        } }
        titulo='<strong>Ambulatório de Saúde Mental</strong>'
      />

      <GraficoInfo
        titulo='Atendimentos no Ambulatório de Saúde Mental'
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
        tooltip='Indicador é calculado a partir de divisão do total de procedimentos registradas pelo total de horas de trabalho estabelecidas em contrato. De tal modo, dados podem apresentar valores subestimados no caso de férias, licenças, feriados, maior números de finais de semana no mês.'
      />
      { atendimentosTotal.length !== 0
        ? (
          <>
            <div className={Style.Filtro}>
              <FiltroTexto
                width={ '50%' }
                dados={ atendimentosTotal }
                valor={ filtroEstabelecimentoAtendimentosTotal }
                setValor={ setFiltroEstabelecimentoAtendimentosTotal }
                label={ 'Estabelecimento' }
                propriedade={ 'estabelecimento' }
              />
            </div>
            <GraficoAtendimentos
              dados={ filtrarPorEstabelecimento(obterAtendimentoGeralPorOcupacoes(), filtroEstabelecimentoAtendimentosTotal) }
              textoTooltipA={ 'Médico psiquiatra' }
              textoTooltipB={ 'Psicólogo clínico' }
              loading={ false }
              propriedade={ 'procedimentos_realizados' }
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }
      <GraficoInfo
        titulo='Atendimentos por horas trabalhadas'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
        tooltip='Indicador é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, maior número de finais de semana no mês.'
      />
      { atendimentosTotal.length !== 0
        ? (
          <>
            <div className={Style.Filtro}>
              <FiltroTexto
                width={ '50%' }
                dados={ atendimentosTotal }
                valor={ filtroEstabelecimentoAtendimentosPorHorasTrabalhadas }
                setValor={ setFiltroEstabelecimentoAtendimentosPorHorasTrabalhadas }
                label={ 'Estabelecimento' }
                propriedade={ 'estabelecimento' }
              />
            </div>
            <GraficoAtendimentos
              dados={ filtrarPorEstabelecimento(obterAtendimentoGeralPorOcupacoes(), filtroEstabelecimentoAtendimentosPorHorasTrabalhadas) }
              textoTooltipA={ 'Médico psiquiatra' }
              textoTooltipB={ 'Psicólogo clínico' }
              loading={ false }
              propriedade={ 'procedimentos_por_hora' }
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }
      <GraficoInfo
        titulo='Pirâmide etária de atendidos'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
      />

      { !loadingPiramideEtaria
        ? <>
          <div className={ Style.Filtros }>
            <FiltroTexto
              dados={ perfilAtendimentos }
              label='Estabelecimento'
              propriedade='estabelecimento'
              valor={ filtroEstabelecimentoPiramideEtaria }
              setValor={ setFiltroEstabelecimentoPiramideEtaria }
            />
            <FiltroCompetencia
              dados={ periodos }
              valor={ filtroPeriodoPiramideEtaria }
              setValor={ setFiltroPeriodoPiramideEtaria }
              label='Competência'
              isMulti
            />
          </div>
          <GraficoGeneroPorFaixaEtaria
            dados={ atendimentosFiltrados }
            labels={ {
              eixoY: 'Nº de usuários únicos nas referências ambulatoriais'
            } }
            loading={ loadingPiramideEtaria }
            propriedades={ {
              faixaEtaria: 'usuario_faixa_etaria',
              sexo: 'usuario_sexo',
              quantidade: 'usuarios_unicos_mes',
            } }

          />
        </>
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Atendimentos por profissional'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
        tooltip='O indicador de atendimentos por hora é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, maior número de finais de semana no mês.'
      />
      { atendimentosPorProfissional.length !== 0
        ? (
          <> <div className={ Style.Filtros }>
            <FiltroTexto
              width={ '50%' }
              dados={ atendimentosPorProfissional }
              valor={ filtroEstabelecimentoAtendimentosPorProfissional }
              setValor={ setFiltroEstabelecimentoAtendimentosPorProfissional }
              label={ 'Estabelecimento' }
              propriedade={ 'estabelecimento' }
              isMulti
              showAllOption
              isDefaultAllOption
            />
            <FiltroCompetencia
              width={ '50%' }
              dados={ atendimentosPorProfissional }
              valor={ filtroCompetenciaAtendimentosPorProfissional }
              setValor={ setFiltroCompetenciaAtendimentosPorProfissional }
              label={ 'Competência' }
              isMulti
              showAllOption
            />
          </div>
          <TabelaAtendimentosPorProfissional
            atendimentos={ agregarFiltrarEOrdenar(atendimentosPorProfissional) }
          />
          </>
        )
        : <Spinner theme='ColorSM' />
      }
    </div>
  );
};

export default Ambulatorio;
