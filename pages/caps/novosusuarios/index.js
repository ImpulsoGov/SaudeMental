import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import ReactEcharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { TabelaGraficoDonut } from '../../../components/Tabelas';
import GraficoGeneroPorFaixaEtaria from '../../../components/Graficos/GeneroPorFaixaEtaria';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import GraficoRacaECor from '../../../components/Graficos/RacaECor';
import { agregarPorAbusoSubstancias, agregarPorSituacaoRua, getOpcoesGraficoAbusoESituacao } from '../../../helpers/graficoAbusoESituacao';
import { agregarQuantidadePorPropriedadeNome, getOpcoesGraficoDonut } from '../../../helpers/graficoDonut';
import { getOpcoesGraficoHistoricoTemporal } from '../../../helpers/graficoHistoricoTemporal';
import { getEstabelecimentos, getPeriodos, getResumoNovosUsuarios, getUsuariosNovosPorCID, getUsuariosNovosPorCondicao, getUsuariosNovosPorGeneroEIdade, getUsuariosNovosPorRacaECor } from '../../../requests/caps';
import { concatenarPeriodos } from '../../../utils/concatenarPeriodos';
import { ordenarDecrescentePorPropriedadeNumerica } from '../../../utils/ordenacao';
import styles from '../Caps.module.css';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import {FILTRO_PERIODO_MULTI_DEFAULT, FILTRO_ESTABELECIMENTO_DEFAULT} from '../../../constants/FILTROS';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const NovoUsuario = () => {
  const { data: session } = useSession();
  const [usuariosNovosPorCID, setUsuariosNovosPorCID] = useState([]);
  const [usuariosNovosPorCondicao, setUsuariosNovosPorCondicao] = useState([]);
  const [usuariosNovosPorGeneroEIdade, setUsuariosNovosPorGeneroEIdade] = useState([]);
  const [usuariosNovosPorRaca, setUsuariosNovosPorRaca] = useState([]);
  const [resumoNovosUsuarios, setResumoNovosUsuarios] = useState([]);
  const [filtroEstabelecimentoHistorico, setFiltroEstabelecimentoHistorico] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoCID, setFiltroPeriodoCID] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoGenero, setFiltroPeriodoGenero] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoCondicao, setFiltroPeriodoCondicao] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoCondicao, setFiltroEstabelecimentoCondicao] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroPeriodoRacaECor, setFiltroPeriodoRacaECor] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroEstabelecimentoRacaECor, setFiltroEstabelecimentoRacaECor] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [loadingCID, setLoadingCID] = useState(false);
  const [loadingGenero, setLoadingGenero] = useState(false);
  const [loadingCondicao, setLoadingCondicao] = useState(false);
  const [loadingRaca, setLoadingRaca] = useState(false);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setEstabelecimentos(
        await getEstabelecimentos(municipioIdSus, 'usuarios_novos_perfil')
      );
      setPeriodos(
        await getPeriodos(municipioIdSus, 'usuarios_novos_perfil')
      );
      setResumoNovosUsuarios(
        await getResumoNovosUsuarios(municipioIdSus)
      );
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const getDadosFiltradosGeneroEFaixaEtaria = useMemo(() => {
    const periodosSelecionados = filtroPeriodoGenero.map(({ value }) => value);

    return usuariosNovosPorGeneroEIdade.filter((item) =>
      item.estabelecimento === filtroEstabelecimentoGenero.value
      && periodosSelecionados.includes(item.periodo)
    );
  }, [usuariosNovosPorGeneroEIdade, filtroPeriodoGenero, filtroEstabelecimentoGenero.value]);
  const agregarPorLinhaPerfil = (usuariosNovos) => {
    const usuariosAgregados = [];

    usuariosNovos.forEach((item) => {
      const {
        estabelecimento,
        nome_mes: nomeMes,
        estabelecimento_linha_perfil: linhaPerfil,
        usuarios_novos: usuariosNovos,
        dif_usuarios_novos_anterior: diferencaMesAnterior
      } = item;

      const linhaPerfilEncontrada = usuariosAgregados
        .find((item) => item.linhaPerfil === linhaPerfil);

      if (!linhaPerfilEncontrada) {
        usuariosAgregados.push({
          nomeMes,
          linhaPerfil,
          usuariosPorEstabelecimento: [{
            estabelecimento,
            usuariosNovos,
            diferencaMesAnterior
          }]
        });
      } else {
        linhaPerfilEncontrada.usuariosPorEstabelecimento.push({
          estabelecimento,
          usuariosNovos,
          diferencaMesAnterior
        });
      }
    });

    return usuariosAgregados;
  };

  const getCardsNovosUsuariosPorEstabelecimento = (novosUsuarios) => {
    const novosUsuariosUltimoPeriodo = novosUsuarios
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

    const usuariosAgregados = agregarPorLinhaPerfil(novosUsuariosUltimoPeriodo);

    const cards = usuariosAgregados.map(({
      linhaPerfil, usuariosPorEstabelecimento, nomeMes
    }) => (
      <>
        <GraficoInfo
          titulo={ `CAPS ${linhaPerfil}` }
          descricao={ `Dados de ${nomeMes}` }
        />

        <Grid12Col
          items={
            usuariosPorEstabelecimento.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.usuariosNovos }
                indice={ item.diferencaMesAnterior }
                indiceDescricao='últ. mês'
                key={ uuidv1() }
              />
            ))
          }
          proporcao='3-3-3-3'
        />
      </>
    ));

    return cards;
  };

  const filtrarPorEstabelecimento = (dados, filtroEstabelecimento) => {
    return dados
      .filter((item) =>
        item.estabelecimento === filtroEstabelecimento.value
        && item.estabelecimento_linha_perfil === 'Todos'
        && item.estabelecimento_linha_idade === 'Todos'
      );
  };

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCondicao(true);

      const valoresPeriodos = filtroPeriodoCondicao.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getUsuariosNovosPorCondicao(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoCondicao.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setUsuariosNovosPorCondicao(dadosFiltrados);
        setLoadingCondicao(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoCondicao.value, filtroPeriodoCondicao]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingGenero(true);

      const valoresPeriodos = filtroPeriodoGenero.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getUsuariosNovosPorGeneroEIdade(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoGenero.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setUsuariosNovosPorGeneroEIdade(dadosFiltrados);
        setLoadingGenero(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoGenero.value, filtroPeriodoGenero]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingRaca(true);

      const valoresPeriodos = filtroPeriodoRacaECor.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getUsuariosNovosPorRacaECor(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoRacaECor.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setUsuariosNovosPorRaca(dadosFiltrados);
        setLoadingRaca(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoRacaECor.value, filtroPeriodoRacaECor]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCID(true);

      const valoresPeriodos = filtroPeriodoCID.map(({ value }) => value);
      const periodosConcatenados = concatenarPeriodos(valoresPeriodos, '-');

      getUsuariosNovosPorCID(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoCID.value,
        periodosConcatenados
      ).then((dadosFiltrados) => {
        setUsuariosNovosPorCID(dadosFiltrados);
        setLoadingCID(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoCID.value, filtroPeriodoCID]);

  const getDadosFiltradosRacaECor = useMemo(() => {
    const periodosSelecionados = filtroPeriodoRacaECor.map(({ value }) => value);

    return usuariosNovosPorRaca.filter((item) =>
      item.estabelecimento === filtroEstabelecimentoRacaECor.value
      && periodosSelecionados.includes(item.periodo)
    );
  }, [usuariosNovosPorRaca, filtroPeriodoRacaECor, filtroEstabelecimentoRacaECor.value]);

  const agregadosPorCID = useMemo(() => {
    const dadosAgregados = agregarQuantidadePorPropriedadeNome(
      usuariosNovosPorCID,
      'usuario_condicao_saude',
      'usuarios_novos'
    );
    const dadosNaoZerados = dadosAgregados.filter(({ quantidade }) => quantidade !== 0);
    const dadosOrdenados = ordenarDecrescentePorPropriedadeNumerica(dadosNaoZerados, 'quantidade');

    return dadosOrdenados;
  }, [usuariosNovosPorCID]);

  const agregadosPorAbusoSubstancias = useMemo(() => {
    return agregarPorAbusoSubstancias(
      usuariosNovosPorCondicao,
      'usuario_abuso_substancias',
      'usuarios_novos'
    );
  }, [usuariosNovosPorCondicao]);

  const agregadosPorSituacaoRua = useMemo(() => {
    return agregarPorSituacaoRua(
      usuariosNovosPorCondicao,
      'usuario_situacao_rua',
      'usuarios_novos'
    );
  }, [usuariosNovosPorCondicao]);

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
        titulo='<strong>Novos usuários</strong>'
      />

      <GraficoInfo
        descricao='Taxa de novos usuários que passaram por primeiro procedimento (registrado em RAAS), excluindo-se usuários que passaram apenas por acolhimento inicial.'
        fonte='Fonte: RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { resumoNovosUsuarios.length !== 0
        ? (
          <>
            <GraficoInfo
              descricao={ `Última competência disponível: ${resumoNovosUsuarios
                .find((item) =>
                  item.estabelecimento === 'Todos'
                  && item.estabelecimento_linha_perfil === 'Todos'
                  && item.estabelecimento_linha_idade === 'Todos'
                  && item.periodo === 'Último período'
                )
                .nome_mes
              }` }
            />

            { getCardsNovosUsuariosPorEstabelecimento(resumoNovosUsuarios) }
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Histórico Temporal'
        fonte='Fonte: RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { resumoNovosUsuarios.length !== 0
        ? (
          <>
            <FiltroTexto
              width={'50%'}
              dados = {resumoNovosUsuarios}
              valor = {filtroEstabelecimentoHistorico}
              setValor = {setFiltroEstabelecimentoHistorico}
              label = {'Estabelecimento'}
              propriedade = {'estabelecimento'}
            />

            <ReactEcharts
              option={ getOpcoesGraficoHistoricoTemporal(
                filtrarPorEstabelecimento(resumoNovosUsuarios, filtroEstabelecimentoHistorico),
                'usuarios_novos',
                'Usuários novos:'
              ) }
              style={ { width: '100%', height: '70vh' } }
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Perfil dos novos usuários'
        fonte='Fonte: RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { usuariosNovosPorCID
        && periodos.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoCID}
                setValor = {setFiltroEstabelecimentoCID}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {periodos}
                valor = {filtroPeriodoCID}
                setValor = {setFiltroPeriodoCID}
                isMulti
                label = {'Competência'}
              />
            </div>

            { loadingCID
              ? <Spinner theme='ColorSM' height='70vh' />
              : <div className={ styles.GraficoCIDContainer }>
                <ReactEcharts
                  option={ getOpcoesGraficoDonut(agregadosPorCID) }
                  style={ { width: '50%', height: '70vh' } }
                />

                <TabelaGraficoDonut
                  labels={ {
                    colunaHeader: 'Grupo de diagnósticos',
                    colunaQuantidade: 'Novos usuários',
                  } }
                  data={ agregadosPorCID }
                  mensagemDadosZerados='Sem usuários nessa competência'
                />
              </div>
            }
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Gênero e faixa etária'
        fonte='Fonte: RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { usuariosNovosPorGeneroEIdade
        && periodos.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoGenero}
                setValor = {setFiltroEstabelecimentoGenero}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {periodos}
                valor = {filtroPeriodoGenero}
                setValor = {setFiltroPeriodoGenero}
                isMulti
                label = {'Competência'}
              />
            </div>
            <GraficoGeneroPorFaixaEtaria
              dados = {getDadosFiltradosGeneroEFaixaEtaria}
              labels={{
                eixoY: 'Usuários novos'
              }}
              loading = {loadingGenero}
              propriedades={{
                faixaEtaria: 'usuario_faixa_etaria',
                sexo: 'usuario_sexo',
                quantidade: 'usuarios_novos',
              }}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Uso de substâncias e condição de moradia'
        fonte='Fonte: RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { usuariosNovosPorCondicao
        && periodos.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoCondicao}
                setValor = {setFiltroEstabelecimentoCondicao}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {periodos}
                valor = {filtroPeriodoCondicao}
                setValor = {setFiltroPeriodoCondicao}
                isMulti
                label = {'Competência'}
              />
            </div>

            { loadingCondicao
              ? <Spinner theme='ColorSM' height='70vh' />
              : <div className={ styles.GraficosUsuariosAtivosContainer }>
                <div className={ styles.GraficoUsuariosAtivos }>
                  <ReactEcharts
                    option={ getOpcoesGraficoAbusoESituacao(
                      agregadosPorAbusoSubstancias,
                      'Fazem uso de substâncias psicoativas?',
                      'ABUSO_SUBSTANCIAS',
                    ) }
                    style={ { width: '100%', height: '100%' } }
                  />
                </div>

                <div className={ styles.GraficoUsuariosAtivos }>
                  <ReactEcharts
                    option={ getOpcoesGraficoAbusoESituacao(
                      agregadosPorSituacaoRua,
                      'Estão em situação de rua?',
                      'SITUACAO_RUA',
                    ) }
                    style={ { width: '100%', height: '100%' } }
                  />
                </div>
              </div>
            }
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Raça/Cor*'
        fonte='Fonte: RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { usuariosNovosPorRaca
        && periodos.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoRacaECor}
                setValor = {setFiltroEstabelecimentoRacaECor}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {periodos}
                valor = {filtroPeriodoRacaECor}
                setValor = {setFiltroPeriodoRacaECor}
                isMulti
                label = {'Competência'}
              />
            </div>
            <GraficoRacaECor
              dados = {getDadosFiltradosRacaECor}
              label={'Usuários novos no período'}
              loading = {loadingRaca}
              propriedades={{
                racaCor: 'usuario_raca_cor',
                quantidade: 'usuarios_novos',
              }}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        descricao='*Dados podem ter problemas de coleta, registro e preenchimento'
      />
    </div>
  );
};

export default NovoUsuario;
