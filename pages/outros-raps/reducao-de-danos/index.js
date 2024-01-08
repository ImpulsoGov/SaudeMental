import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import FiltroTexto from '../../../components/Filtros/FiltroTexto';
import { GraficoHistoricoTemporal } from '../../../components/Graficos';
import { FILTRO_ESTABELECIMENTO_MULTI_DEFAULT, FILTRO_OCUPACAO_DEFAULT } from '../../../constants/FILTROS';
import { MUNICIPIOS_ID_SUS_SEM_REDUCAO_DE_DANOS } from '../../../constants/MUNICIPIOS_SEM_OUTROS_SERVICOS.js';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { getEstabelecimentos } from '../../../requests/caps';
import { getAcoesReducaoDeDanos12meses, obterAcoesReducaoDeDanos, obterOcupacoesReducaoDeDanos } from '../../../requests/outros-raps';
import styles from '../OutrosRaps.module.css';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ReducaoDeDanos = () => {
  const { data: session } = useSession();
  const [acaoUltimoPeriodo, setAcaoUltimoPeriodo] = useState(null);
  const [acoes12meses, setAcoes12meses] = useState([]);
  const [acoesHistoricoTemporal, setAcoesHistoricoTemporal] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [ocupacoes, setOcupacoes] = useState([]);
  const [filtroEstabelecimento, setFiltroEstabelecimento] = useState(FILTRO_ESTABELECIMENTO_MULTI_DEFAULT);
  const [filtroOcupacao, setFiltroOcupacao] = useState(FILTRO_OCUPACAO_DEFAULT);
  const municipioSemReducaoDanos = MUNICIPIOS_ID_SUS_SEM_REDUCAO_DE_DANOS.includes(session?.user.municipio_id_ibge);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setOcupacoes(await obterOcupacoesReducaoDeDanos(municipioIdSus));
      setEstabelecimentos(
        await getEstabelecimentos(municipioIdSus, 'reducao_de_danos')
      );

      const [acaoReducaoUltimoPeriodo] = await obterAcoesReducaoDeDanos({
        municipioIdSus,
        estabelecimentos: 'Todos',
        periodos: 'Último período',
        ocupacoes: 'Todas'
      });

      setAcaoUltimoPeriodo(acaoReducaoUltimoPeriodo);
      setAcoes12meses(await getAcoesReducaoDeDanos12meses(municipioIdSus));
    };

    if (session?.user.municipio_id_ibge && !municipioSemReducaoDanos) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, [session?.user.municipio_id_ibge, municipioSemReducaoDanos]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingHistorico(true);

      const promises = filtroEstabelecimento.map(({ value: estabelecimento }) => {
        return obterAcoesReducaoDeDanos({
          municipioIdSus: session?.user.municipio_id_ibge,
          estabelecimentos: estabelecimento,
          ocupacoes: filtroOcupacao.value
        });
      });

      Promise.all(promises).then((respostas) => {
        const respostasUnificadas = [].concat(...respostas);
        setAcoesHistoricoTemporal(respostasUnificadas);
      });

      setLoadingHistorico(false);
    }
  }, [
    session?.user.municipio_id_ibge,
    filtroEstabelecimento,
    filtroOcupacao
  ]);

  const getPropsCardUltimos12Meses = (acoes) => {
    const acaoTodosUltimos12Meses = acoes
      .find((acao) => acao.estabelecimento === 'Todos' && acao.profissional_vinculo_ocupacao === 'Todas');

    return {
      key: acaoTodosUltimos12Meses.id,
      indicador: acaoTodosUltimos12Meses['quantidade_registrada'],
      titulo: `Total de ações de redução de danos nos últimos 12 meses de ${acaoTodosUltimos12Meses['a_partir_do_mes']}/${acaoTodosUltimos12Meses['a_partir_do_ano']} a ${acaoTodosUltimos12Meses['ate_mes']}/${acaoTodosUltimos12Meses['ate_ano']}`,
      indice: acaoTodosUltimos12Meses['dif_quantidade_registrada_anterior'],
      indiceDescricao: 'doze meses anteriores'
    };
  };

  const agregarQuantidadePorPeriodo = (dados) => {
    const dadosAgregados = [];

    dados.forEach(({ periodo, competencia, quantidade_registrada: quantidade }) => {
      const periodoEncontrado = dadosAgregados.find((item) => periodo === item.periodo);

      if (periodoEncontrado) {
        periodoEncontrado.quantidade += quantidade;
      } else {
        dadosAgregados.push({ periodo, competencia, quantidade });
      }
    });

    return dadosAgregados;
  };

  const acoesAgregadas = useMemo(() => {
    return agregarQuantidadePorPeriodo(acoesHistoricoTemporal);
  }, [acoesHistoricoTemporal]);

  if (municipioSemReducaoDanos) {
    return (
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto='Essa página não está exibindo dados porque a coordenação da RAPS informou que não são feitas Ações de Redução de Danos no município, ou que essas ações não são registradas em BPA-c na rede. Caso queira solicitar a inclusão, entre em contato via nosso <u><a style="color:inherit" href="/duvidas" target="_blank">formulário de solicitação de suporte</a></u>, <u><a style="color:inherit" href="https://wa.me/5511942642429" target="_blank">whatsapp</a></u> ou e-mail (saudemental@impulsogov.org).'
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
        texto=""
        botao={ {
          label: '',
          url: ''
        } }
        titulo="<strong>Ações de Redução de Danos</strong>"
      />

      <GraficoInfo
        titulo="Ações de redução de danos realizadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        tooltip="Total de procedimentos registrados por estabelecimentos do tipo CAPS como 'ação de redução de danos', segundo informado pelos profissionais de saúde por meio dos Boletins de Produção Ambulatorial consolidados (BPA-c)."
      />

      <Grid12Col
        items={ [
          <>
            { acaoUltimoPeriodo
              ? <CardInfoTipoA
                key={ acaoUltimoPeriodo.id }
                indicador={ acaoUltimoPeriodo['quantidade_registrada'] }
                titulo={ `Total de ações de redução de danos em ${acaoUltimoPeriodo['nome_mes']}` }
                indice={ acaoUltimoPeriodo['dif_quantidade_registrada_anterior'] }
                indiceDescricao='últ. mês'
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { acoes12meses.length !== 0
              ? <CardInfoTipoA { ...getPropsCardUltimos12Meses(acoes12meses) } />
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <div className={ styles.Filtros }>
        { estabelecimentos.length !== 0 &&
          <FiltroTexto
            dados={ estabelecimentos }
            label='Estabelecimento'
            propriedade='estabelecimento'
            valor={ filtroEstabelecimento }
            setValor={ setFiltroEstabelecimento }
            isMulti
          />
        }

        { ocupacoes.length !== 0 &&
          <FiltroTexto
            dados={ ocupacoes }
            label='CBO do profissional'
            propriedade='profissional_vinculo_ocupacao'
            valor={ filtroOcupacao }
            setValor={ setFiltroOcupacao }
          />
        }
      </div>

      <GraficoHistoricoTemporal
        dados={ acoesAgregadas }
        textoTooltip='Ações registradas'
        propriedade='quantidade'
        loading={ loadingHistorico }
      />
    </div>
  );
};

export default ReducaoDeDanos;
