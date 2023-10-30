import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import { GraficoHistoricoTemporal, GraficoProcedimentosPorTempoServico } from "../../../components/Graficos";
import { FILTRO_ESTABELECIMENTO_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../../constants/FILTROS';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getEstabelecimentos, getPeriodos, getProcedimentosPorEstabelecimento, obterProcedimentosPorTempoServico } from "../../../requests/caps";
import { ordenarCrescentePorPropriedadeDeTexto } from "../../../utils/ordenacao";
import styles from "../Caps.module.css";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ProcedimentosPorUsuarios = () => {
  const { data: session } = useSession();
  const [procedimentosPorEstabelecimento, setProcedimentosPorEstabelecimento] = useState([]);
  const [procedimentosPorTempoServico, setProcedimentosPorTempoServico] = useState([]);
  const [filtroEstabelecimentoProcedimento, setFiltroEstabelecimentoProcedimento] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoProcedimento, setFiltroPeriodoProcedimento] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [loadingProcedimentosPorTempoServico, setLoadingProcedimentosPorTempoServico] = useState(true);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setProcedimentosPorEstabelecimento(await getProcedimentosPorEstabelecimento(municipioIdSus));
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
  }, []);

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

  const agregarPorLinhaPerfil = (procedimentos) => {
    const procedimentosAgregados = [];

    procedimentos.forEach((procedimento) => {
      const {
        estabelecimento,
        nome_mes: nomeMes,
        estabelecimento_linha_perfil: linhaPerfil,
        procedimentos_por_usuario: procedimentosPorUsuario,
        dif_procedimentos_por_usuario_anterior_perc: difPorcentagemProcedimentosAnterior
      } = procedimento;

      const linhaPerfilEncontrada = procedimentosAgregados
        .find((item) => item.linhaPerfil === linhaPerfil);

      if (!linhaPerfilEncontrada) {
        procedimentosAgregados.push({
          nomeMes,
          linhaPerfil,
          procedimentosPorEstabelecimento: [{
            estabelecimento,
            procedimentosPorUsuario,
            difPorcentagemProcedimentosAnterior
          }]
        });
      } else {
        linhaPerfilEncontrada.procedimentosPorEstabelecimento.push({
          estabelecimento,
          procedimentosPorUsuario,
          difPorcentagemProcedimentosAnterior
        });
      }
    });

    return procedimentosAgregados;
  };

  const getCardsProcedimentosPorEstabelecimento = (procedimentos) => {
    const procedimentosPorEstabelecimentoUltimoPeriodo = procedimentos
      .filter(({
        periodo,
        estabelecimento,
        estabelecimento_linha_perfil: linhaPerfil,
        estabelecimento_linha_idade: linhaIdade
      }) =>
        periodo === 'Último período'
        && estabelecimento !== 'Todos'
        && linhaPerfil !== 'Todos'
        && linhaIdade === 'Todos'
      );

    const procedimentosAgregados = agregarPorLinhaPerfil(procedimentosPorEstabelecimentoUltimoPeriodo);

    const cardsProcedimentosPorEstabelecimento = procedimentosAgregados.map(({
      linhaPerfil, procedimentosPorEstabelecimento, nomeMes
    }) => {
      const procedimentosOrdenados = ordenarCrescentePorPropriedadeDeTexto(
        procedimentosPorEstabelecimento,
        'estabelecimento'
      );

      return (
        <>
          <GraficoInfo
            titulo={ `CAPS ${linhaPerfil}` }
            descricao={ `Dados de ${nomeMes}` }
          />

          <Grid12Col
            items={
              procedimentosOrdenados.map((item) => (
                <CardInfoTipoA
                  titulo={ item.estabelecimento }
                  indicador={ item.procedimentosPorUsuario }
                  indice={ item.difPorcentagemProcedimentosAnterior }
                  indiceSimbolo='%'
                  indiceDescricao='últ. mês'
                  key={ uuidv1() }
                />
              ))
            }
            proporcao='3-3-3-3'
          />
        </>
      );
    });

    return cardsProcedimentosPorEstabelecimento;
  };

  const procedimentosPorEstabelecimentoFiltrados = useMemo(() => {
    return procedimentosPorEstabelecimento
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimentoHistorico.value
        && item.estabelecimento_linha_perfil === 'Todos'
        && item.estabelecimento_linha_idade === 'Todos'
      );
  }, [procedimentosPorEstabelecimento, filtroEstabelecimentoHistorico.value]);

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

      { procedimentosPorEstabelecimento.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${procedimentosPorEstabelecimento
                .find((item) =>
                  item.estabelecimento === 'Todos'
                  && item.estabelecimento_linha_perfil === 'Todos'
                  && item.estabelecimento_linha_idade === 'Todos'
                  && item.periodo === 'Último período'
                )
                .nome_mes
                }` }
            />

            { getCardsProcedimentosPorEstabelecimento(procedimentosPorEstabelecimento) }
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Histórico Temporal'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />
      { procedimentosPorEstabelecimento.length !== 0
        ? (
          <>
            <FiltroTexto
              width={ '50%' }
              dados={ procedimentosPorEstabelecimento }
              valor={ filtroEstabelecimentoHistorico }
              setValor={ setFiltroEstabelecimentoHistorico }
              label={ 'Estabelecimento' }
              propriedade={ 'estabelecimento' }
            />

            <GraficoHistoricoTemporal
              dados={ procedimentosPorEstabelecimentoFiltrados }
              textoTooltip={ filtroEstabelecimentoHistorico.value }
              propriedade='procedimentos_por_usuario'
              loading={ false }
            />
          </>
        )
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
          dados={ procedimentosPorTempoServico }
          textoTooltip='Média de procedimentos'
        />
      }
    </div>
  );
};

export default ProcedimentosPorUsuarios;
