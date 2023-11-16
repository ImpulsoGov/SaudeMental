import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import { GraficoDonut, GraficoHistoricoTemporal } from '../../../components/Graficos';
import { TabelaGraficoDonut } from '../../../components/Tabelas';
import { FILTRO_PERIODO_MULTI_DEFAULT, FILTRO_TEXTO_DEFAULT } from '../../../constants/FILTROS';
import { MUNICIPIOS_ID_SUS_SEM_CONSULTORIO_NA_RUA } from '../../../constants/MUNICIPIOS_SEM_OUTROS_SERVICOS.JS';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from '../../../requests/outros-raps';
import styles from '../OutrosRaps.module.css';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ConsultorioNaRua = () => {
  const { data: session } = useSession();
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentos12meses, setAtendimentos12meses] = useState([]);
  const [filtroProducao, setFiltroProducao] = useState(FILTRO_TEXTO_DEFAULT);
  const [filtroCompetencia, setFiltroCompetencia] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const municipioSemConsultorioNaRua = MUNICIPIOS_ID_SUS_SEM_CONSULTORIO_NA_RUA.includes(session?.user.municipio_id_ibge);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendimentos(await getAtendimentosConsultorioNaRua(municipioIdSus));
      setAtendimentos12meses(
        await getAtendimentosConsultorioNaRua12meses(municipioIdSus)
      );
    };

    if (session?.user.municipio_id_ibge && !municipioSemConsultorioNaRua) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const atendimentosFiltradosPorProducao = useMemo(() => {
    return atendimentos.filter(({ tipo_producao: tipoProducao }) => tipoProducao === filtroProducao.value);
  }, [atendimentos, filtroProducao.value]);

  const atendimentosFiltradosPorPeriodo = useMemo(() => {
    const periodosSelecionados = filtroCompetencia.map(({ value }) => value);

    return atendimentos.filter(({
      tipo_producao: tipoProducao,
      periodo,
    }) =>
      tipoProducao !== 'Todos'
      && periodosSelecionados.includes(periodo)
    );
  }, [atendimentos, filtroCompetencia]);

  const getPropsCardUltimoPeriodo = () => {
    const atendimentoTodosUltimoPeriodo = atendimentos
      .find((atendimento) => atendimento.tipo_producao === 'Todos' && atendimento.periodo === 'Último período');

    return {
      key: uuidv4(),
      indicador: atendimentoTodosUltimoPeriodo['quantidade_registrada'],
      titulo: `Total de atendimentos em ${atendimentoTodosUltimoPeriodo['nome_mes']}`,
      indice: atendimentoTodosUltimoPeriodo['dif_quantidade_registrada_anterior'],
      indiceDescricao: 'últ. mês'
    };
  };

  const getPropsCardUltimos12Meses = () => {
    const atendimentoTodosUltimos12Meses = atendimentos12meses
      .find(({ tipo_producao: tipoProducao }) => tipoProducao === 'Todos');

    return {
      key: uuidv4(),
      indicador: atendimentoTodosUltimos12Meses['quantidade_registrada'],
      titulo: `Total de atendimentos nos últimos 12 meses de ${atendimentoTodosUltimos12Meses['a_partir_do_mes']}/${atendimentoTodosUltimos12Meses['a_partir_do_ano']} a ${atendimentoTodosUltimos12Meses['ate_mes']}/${atendimentoTodosUltimos12Meses['ate_ano']}`,
      indice: atendimentoTodosUltimos12Meses['dif_quantidade_registrada_anterior'],
      indiceDescricao: 'doze meses anteriores'
    };
  };

  const encontrarMesDeUltimoPeriodo = (dados) => {
    const ultimoPeriodo = dados.find(({ periodo, tipo_producao: tipoProducao }) =>
      tipoProducao === 'Todos' && periodo === 'Último período'
    );

    return ultimoPeriodo.nome_mes;
  };

  if (municipioSemConsultorioNaRua) {
    return (
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto='Essa página não está exibindo dados porque a coordenação da RAPS informou que não há equipes de Consultório na Rua cadastradas na rede de seu município. Caso queira solicitar a inclusão, entre em contato via nosso <u><a style="color:inherit" href="/duvidas" target="_blank">formulário de solicitação de suporte</a></u>, <u><a style="color:inherit" href="https://wa.me/5511941350260" target="_blank">whatsapp</a></u> ou e-mail (saudemental@impulsogov.org).'
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
        titulo='<strong>Consultório na Rua</strong>'
      />

      { atendimentos.length !== 0 &&
        <GraficoInfo
          descricao={ `Última competência disponível: ${encontrarMesDeUltimoPeriodo(atendimentos)}` }
        />
      }

      <GraficoInfo
        titulo='Atendimentos realizados por equipes'
        fonte='Fonte: SISAB - Elaboração Impulso Gov'
        descricao='Equipes de Consultório na Rua habilitadas no Ministério da Saúde​'
        tooltip='Total de contatos assistenciais promovidos por todas as equipes de CnR ao longo de um período, considerados atendimentos individuais, odontológicos, procedimentos e visitas domiciliares.'
      />

      <Grid12Col
        items={ [
          <>
            { atendimentos.length !== 0
              ? <CardInfoTipoA { ...getPropsCardUltimoPeriodo() } />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { atendimentos12meses.length !== 0
              ? <CardInfoTipoA { ...getPropsCardUltimos12Meses() } />
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo='Tipo de produção'
        fonte='Fonte: SISAB - Elaboração Impulso Gov'
      />

      { atendimentos.length !== 0
        ? <>
          <FiltroCompetencia
            dados={ atendimentos }
            valor={ filtroCompetencia }
            setValor={ setFiltroCompetencia }
            label='Competência'
            isMulti
          />

          <div className={ styles.GraficoDonutContainer }>
            <GraficoDonut
              dados={ atendimentosFiltradosPorPeriodo }
              propriedades={ {
                nome: 'tipo_producao',
                quantidade: 'quantidade_registrada'
              } }
            />

            <TabelaGraficoDonut
              labels={ {
                colunaHeader: 'Tipo de produção',
                colunaQuantidade: 'Quantidade registrada',
              } }
              propriedades={ {
                nome: 'tipo_producao',
                quantidade: 'quantidade_registrada'
              } }
              data={ atendimentosFiltradosPorPeriodo }
              mensagemDadosZerados='Sem produção registrada nessa competência'
            />
          </div>
        </>
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo='Histórico Temporal'
        fonte='Fonte: SISAB - Elaboração Impulso Gov'
      />

      { atendimentos.length !== 0
        ? <>
          <FiltroTexto
            dados={ atendimentos }
            label='Tipo de produção'
            propriedade='tipo_producao'
            valor={ filtroProducao }
            setValor={ setFiltroProducao }
          />

          <GraficoHistoricoTemporal
            dados={ atendimentosFiltradosPorProducao }
            textoTooltip='Atendimentos realizados'
            propriedade='quantidade_registrada'
            loading={ false }
          />
        </>
        : <Spinner theme="ColorSM" />
      }
    </div>
  );
};

export default ConsultorioNaRua;
