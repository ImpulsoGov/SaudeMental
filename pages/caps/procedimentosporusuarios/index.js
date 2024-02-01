import { GraficoInfo, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import { GraficoHistoricoTemporal, GraficoProcedimentosPorTempoServico } from "../../../components/Graficos";
import { FILTRO_ESTABELECIMENTO_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getEstabelecimentos, getPeriodos, obterProcedimentosPorEstabelecimento, obterProcedimentosPorTempoServico } from "../../../requests/caps";
import styles from "../Caps.module.css";
import { CardsResumoEstabelecimentos } from "../../../components/CardsResumoEstabelecimentos";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ProcedimentosPorUsuarios = () => {
  const { data: session } = useSession();
  const [procedimentosPorEstabelecimento, setProcedimentosPorEstabelecimento] = useState([]);
  const [procedimentosPorTempoServico, setProcedimentosPorTempoServico] = useState([]);
  const [resumoPorEstabelecimento, setResumoPorEstabelecimento] = useState([]);
  const [nomeUltimoMes, setNomeUltimoMes] = useState('');
  const [filtroEstabelecimentoProcedimento, setFiltroEstabelecimentoProcedimento] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoProcedimento, setFiltroPeriodoProcedimento] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [loadingProcedimentosPorTempoServico, setLoadingProcedimentosPorTempoServico] = useState(true);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      const dadosFiltradosResumo = await obterProcedimentosPorEstabelecimento({
        municipioIdSus: session?.user.municipio_id_ibge,
        periodos: 'Último período',
      });

      const resumoGeral = dadosFiltradosResumo.find((item) => (item.estabelecimento === 'Todos'));

      setNomeUltimoMes(resumoGeral.nome_mes);

      const resumoPorEstabelecimentoELinhaPerfil = dadosFiltradosResumo.filter((item) => (
        item.estabelecimento !== 'Todos' && item.estabelecimento_linha_perfil !== 'Todos'
      ));

      setResumoPorEstabelecimento(resumoPorEstabelecimentoELinhaPerfil);
      setEstabelecimentos(await getEstabelecimentos(
        municipioIdSus,
        "procedimentos_usuarios_tempo_servico"
      ));
      setPeriodos(await getPeriodos(
        municipioIdSus,
        "procedimentos_usuarios_tempo_servico"
      ));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, [session?.user.municipio_id_ibge]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingProcedimentosPorTempoServico(true);

      const promises = filtroPeriodoProcedimento.map(({ value: periodo }) => {
        return obterProcedimentosPorTempoServico({
          municipioIdSus: session?.user.municipio_id_ibge,
          estabelecimentos: filtroEstabelecimentoProcedimento.value,
          periodos: periodo
        });
      });

      Promise.all(promises).then((respostas) => {
        const respostasUnificadas = [].concat(...respostas);
        setProcedimentosPorTempoServico(respostasUnificadas);
      });

      setLoadingProcedimentosPorTempoServico(false);
    }
  }, [
    session?.user.municipio_id_ibge,
    filtroEstabelecimentoProcedimento.value,
    filtroPeriodoProcedimento
  ]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingHistorico(true);

      obterProcedimentosPorEstabelecimento({
        municipioIdSus: session?.user.municipio_id_ibge,
        estabelecimentos: filtroEstabelecimentoHistorico.value,
      }).then((dadosFiltrados) => setProcedimentosPorEstabelecimento(dadosFiltrados));

      setLoadingHistorico(false);
    }
  }, [
    session?.user.municipio_id_ibge,
    filtroEstabelecimentoHistorico.value
  ]);
const arrayVazio = [];
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
        titulo="<strong>Procedimentos por usuários</strong>"
      />

      <GraficoInfo
        descricao='Taxa de procedimentos registrados pelo número de usuários com fichas movimentadas durante o mês de referência'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { nomeUltimoMes &&
        <GraficoInfo
          descricao={ `Última competência disponível: ${nomeUltimoMes}` }
        />
      }

      <CardsResumoEstabelecimentos
        dados={ resumoPorEstabelecimento }
        propriedades={{
          estabelecimento: 'estabelecimento',
          quantidade: 'procedimentos_por_usuario',
          difAnterior: 'dif_procedimentos_por_usuario_anterior_perc',
        }}
        indiceSimbolo='%'
        indiceDescricao='últ. mês'
      />

      <GraficoInfo
        titulo='Histórico Temporal'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { estabelecimentos.length !== 0 &&
        <FiltroTexto
          width={ '50%' }
          dados={ estabelecimentos }
          valor={ filtroEstabelecimentoHistorico }
          setValor={ setFiltroEstabelecimentoHistorico }
          label={ 'Estabelecimento' }
          propriedade={ 'estabelecimento' }
        />
      }

      { procedimentosPorEstabelecimento.length !== 0
        ? <GraficoHistoricoTemporal
          dados={ arrayVazio } //procedimentosPorEstabelecimento
          textoTooltip={ filtroEstabelecimentoHistorico.value }
          propriedade='procedimentos_por_usuario'
          loading={ loadingHistorico }
        />
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Procedimento por usuários x tempo do usuário no serviço'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      <div className={ styles.Filtros }>
        <FiltroTexto
          width={ '50%' }
          dados={ estabelecimentos }
          valor={ filtroEstabelecimentoProcedimento }
          setValor={ setFiltroEstabelecimentoProcedimento }
          label={ 'Estabelecimento' }
          propriedade={ 'estabelecimento' }
        />

        <FiltroCompetencia
          width={ '50%' }
          dados={ periodos }
          valor={ filtroPeriodoProcedimento }
          setValor={ setFiltroPeriodoProcedimento }
          isMulti
          label={ 'Competência' }
        />
      </div>

      { loadingProcedimentosPorTempoServico
        ? <Spinner theme="ColorSM" />
        : <GraficoProcedimentosPorTempoServico
          dados={ arrayVazio } // procedimentosPorTempoServico
          textoTooltip='Média de procedimentos'
        />
      }
    </div>
  );
};

export default ProcedimentosPorUsuarios;
