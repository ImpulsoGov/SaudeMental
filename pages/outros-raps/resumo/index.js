import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { MUNICIPIOS_ID_SUS_SEM_CARDS_AMBULATORIO, MUNICIPIOS_ID_SUS_SEM_CONSULTORIO_NA_RUA, MUNICIPIOS_ID_SUS_SEM_REDUCAO_DE_DANOS, MUNICIPIOS_ID_SUS_COM_OUTROS_RAPS_SEM_DADOS } from '../../../constants/MUNICIPIOS_SEM_OUTROS_SERVICOS.js';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { obterAcoesReducaoDeDanos, getAcoesReducaoDeDanos12meses, getAtendimentosAmbulatorioResumoUltimoMes, getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from '../../../requests/outros-raps';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Resumo = () => {
  const { data: session } = useSession();
  const [consultorioNaRua, setConsultorioNaRua] = useState([]);
  const [consultorioNaRua12Meses, setConsultorioNaRua12Meses] = useState([]);
  const [reducaoDanos, setReducaoDanos] = useState(null);
  const [reducaoDanos12Meses, setReducaoDanos12Meses] = useState([]);
  const [ambulatorioUltMes, setAmbulatorioUltMes] = useState([]);
  const municipioSemCardsAmbulatorio = MUNICIPIOS_ID_SUS_SEM_CARDS_AMBULATORIO.includes(session?.user.municipio_id_ibge);
  const municipioSemCardsReducaoDanos = MUNICIPIOS_ID_SUS_SEM_REDUCAO_DE_DANOS.includes(session?.user.municipio_id_ibge);
  const municipioSemCardsConsultorioNaRua = MUNICIPIOS_ID_SUS_SEM_CONSULTORIO_NA_RUA.includes(session?.user.municipio_id_ibge);
  const municipioSemDadosDeOutrosRaps = MUNICIPIOS_ID_SUS_COM_OUTROS_RAPS_SEM_DADOS.includes(session?.user.municipio_id_ibge);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      if (!municipioSemCardsConsultorioNaRua) {
        setConsultorioNaRua(await getAtendimentosConsultorioNaRua(municipioIdSus));
        setConsultorioNaRua12Meses(
          await getAtendimentosConsultorioNaRua12meses(municipioIdSus)
        );
      }

      if (!municipioSemCardsReducaoDanos) {
        const [reducaoDanosUltimoPeriodo] = await obterAcoesReducaoDeDanos({
          municipioIdSus,
          periodos: 'Último período',
          estabelecimentos: 'Todos',
          ocupacoes: 'Todas'
        });

        setReducaoDanos(reducaoDanosUltimoPeriodo);
        setReducaoDanos12Meses(await getAcoesReducaoDeDanos12meses(municipioIdSus));
      }

      if (!municipioSemCardsAmbulatorio) {
        setAmbulatorioUltMes(
          await getAtendimentosAmbulatorioResumoUltimoMes(municipioIdSus)
        );
      }
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, [session?.user.municipio_id_ibge, municipioSemCardsAmbulatorio, municipioSemCardsConsultorioNaRua, municipioSemCardsReducaoDanos, ]);

  const getDadosConsultorioNaRua = () => {
    return consultorioNaRua.find((item) =>
      item.periodo === 'Último período' && item.tipo_producao === 'Todos');
  };

  const getDadosConsultorioNaRua12meses = () => {
    return consultorioNaRua12Meses.find((item) =>
      item.tipo_producao === 'Todos');
  };

  const getDadosReducaoDanos12meses = () => {
    return reducaoDanos12Meses.find((item) =>
      item.estabelecimento === 'Todos'
      && item.profissional_vinculo_ocupacao === 'Todas'
    );
  };

  const getDadosAmbulatorioUltimoMes = () => {
    return ambulatorioUltMes.find((item) =>
      item.periodo === 'Último período'
      && item.estabelecimento === 'Todos'
      && item.ocupacao === 'Todas'
    );
  };

  if (
    municipioSemDadosDeOutrosRaps
  ) {
    return (
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto='Essa página não está exibindo dados porque, apesar da coordenação da RAPS ter informado que o município possui um ou mais serviços dessa seção, não fomos capazes de encontrar registros deles nas bases que utilizamos para a formulação dos indicadores. Para maiores detalhamentos, acesse a página específica de cada serviço, entre em contato via nosso <u><a style="color:inherit" href="/duvidas" target="_blank">formulário de solicitação de suporte</a></u>, <u><a style="color:inherit" href="https://wa.me/5511942642429" target="_blank">whatsapp</a></u> ou e-mail (saudemental@impulsogov.org).'
        botao={ {
          label: '',
          url: ''
        } }
      />
    );
  }else if (
    municipioSemCardsAmbulatorio
    && municipioSemCardsReducaoDanos
    && municipioSemCardsConsultorioNaRua
  ) {
    return (
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto='Essa página não está exibindo dados porque a coordenação da RAPS informou que o município não possui Ambulatórios vinculados diretamente à RAPS, não possui equipes de Consultório na Rua cadastradas na rede e não registra procedimentos de Redução de Danos. Caso queira solicitar a inclusão de alguns desses serviços, entre em contato via nosso <u><a style="color:inherit" href="/duvidas" target="_blank">formulário de solicitação de suporte</a></u>, <u><a style="color:inherit" href="https://wa.me/5511942642429" target="_blank">whatsapp</a></u> ou e-mail (saudemental@impulsogov.org).'
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
        titulo='<strong>Resumo</strong>'
      />

      { !municipioSemCardsAmbulatorio &&
        <>
          <GraficoInfo
            titulo='Ambulatório de Saúde Mental'
            fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
            link={ { label: 'Mais informações', url: '/outros-raps?painel=1' } }
          />

          <Grid12Col
            items={ [
              <>
                { ambulatorioUltMes.length !== 0
                  ? <CardInfoTipoA
                    key={ getDadosAmbulatorioUltimoMes().id }
                    indicador={ getDadosAmbulatorioUltimoMes().procedimentos_realizados }
                    titulo={ `Total de atendimentos em ${getDadosAmbulatorioUltimoMes().nome_mes}` }
                    indice={ getDadosAmbulatorioUltimoMes().dif_procedimentos_realizados_anterior }
                    indiceDescricao='últ. mês'
                  />
                  : <Spinner theme='ColorSM' />
                }
              </>,
              <>
                { ambulatorioUltMes.length !== 0
                  ? <CardInfoTipoA
                    key={ getDadosAmbulatorioUltimoMes().id }
                    indicador={ getDadosAmbulatorioUltimoMes().procedimentos_por_hora }
                    titulo={ `Total de atendimentos por hora trabalhada em ${getDadosAmbulatorioUltimoMes().nome_mes}` }
                    indice={ getDadosAmbulatorioUltimoMes().dif_procedimentos_por_hora_anterior }
                    indiceDescricao='últ. mês'
                  />
                  : <Spinner theme='ColorSM' />
                }
              </>,
            ] }
          />
        </>
      }

      { !municipioSemCardsConsultorioNaRua &&
        <>
          <GraficoInfo
            titulo='Consultório na Rua'
            fonte='Fonte: SISAB - Elaboração Impulso Gov'
            link={ { label: 'Mais informações', url: '/outros-raps?painel=2' } }
          />

          <Grid12Col
            items={ [
              <>
                { consultorioNaRua.length !== 0
                  ? <CardInfoTipoA
                    key={ getDadosConsultorioNaRua().id }
                    indicador={ getDadosConsultorioNaRua().quantidade_registrada }
                    titulo={ `Total de atendimentos em ${getDadosConsultorioNaRua().nome_mes}` }
                    indice={ getDadosConsultorioNaRua().dif_quantidade_registrada_anterior }
                    indiceDescricao='últ. mês'
                  />
                  : <Spinner theme='ColorSM' />
                }
              </>,
              <>
                { consultorioNaRua12Meses.length !== 0
                  ? <CardInfoTipoA
                    key={ getDadosConsultorioNaRua12meses().id }
                    indicador={ getDadosConsultorioNaRua12meses().quantidade_registrada }
                    titulo={ `Total de atendimentos entre ${getDadosConsultorioNaRua12meses().a_partir_do_mes}/${getDadosConsultorioNaRua12meses().a_partir_do_ano} e ${getDadosConsultorioNaRua12meses().ate_mes}/${getDadosConsultorioNaRua12meses().ate_ano}` }
                    indice={ getDadosConsultorioNaRua12meses().dif_quantidade_registrada_anterior }
                    indiceDescricao='doze meses anteriores'
                  />
                  : <Spinner theme='ColorSM' />
                }
              </>,
            ] }
          />
        </>
      }

      { !municipioSemCardsReducaoDanos &&
        <>
          <GraficoInfo
            titulo='Ações de redução de danos'
            fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
            link={ { label: 'Mais informações', url: '/outros-raps?painel=3' } }
          />

          <Grid12Col
            items={ [
              <>
                { reducaoDanos
                  ? <CardInfoTipoA
                    key={ reducaoDanos.id }
                    indicador={ reducaoDanos.quantidade_registrada }
                    titulo={ `Total de ações de redução de danos em ${reducaoDanos.nome_mes}` }
                    indice={ reducaoDanos.dif_quantidade_registrada_anterior }
                    indiceDescricao='últ. mês'
                  />
                  : <Spinner theme='ColorSM' />
                }
              </>,
              <>
                { reducaoDanos12Meses.length !== 0
                  ? <CardInfoTipoA
                    key={ getDadosReducaoDanos12meses().id }
                    indicador={ getDadosReducaoDanos12meses().quantidade_registrada }
                    titulo={ `Total ações de redução de danos entre ${getDadosReducaoDanos12meses().a_partir_do_mes}/${getDadosReducaoDanos12meses().a_partir_do_ano} e ${getDadosReducaoDanos12meses().ate_mes}/${getDadosReducaoDanos12meses().ate_ano}` }
                    indice={ getDadosReducaoDanos12meses().dif_quantidade_registrada_anterior }
                    indiceDescricao='doze meses anteriores'
                  />
                  : <Spinner theme='ColorSM' />
                }
              </>,
            ] }
          />
        </>
      }
    </div>
  );
};

export default Resumo;
