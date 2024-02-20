import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import styles from '../Caps.module.css';
import GraficoGeneroPorFaixaEtaria from '../../../components/Graficos/GeneroPorFaixaEtaria';
import { TabelaGraficoDonut, TabelaDetalhamentoPorCaps } from '../../../components/Tabelas';
import GraficoRacaECor from '../../../components/Graficos/RacaECor';
import { getEstabelecimentos, obterPerfilUsuariosPorEstabelecimento, getPeriodos, getUsuariosAtivosPorCID, getUsuariosAtivosPorCondicao, getUsuariosAtivosPorGeneroEIdade, getUsuariosAtivosPorRacaECor } from '../../../requests/caps';
import { FiltroCompetencia, FiltroTexto } from '../../../components/Filtros';
import {FILTRO_PERIODO_DEFAULT, FILTRO_ESTABELECIMENTO_DEFAULT} from '../../../constants/FILTROS';
import { GraficoCondicaoUsuarios, GraficoDonut } from '../../../components/Graficos';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const PerfilUsuario = () => {
  const { data: session } = useSession();
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [usuariosPorCondicao, setUsuariosPorCondicao] = useState([]);
  const [usuariosPorGeneroEIdade, setUsuariosPorGeneroEIdade] = useState([]);
  const [usuariosPorRacaECor, setUsuariosPorRacaECor] = useState([]);
  const [usuariosPorCID, setUsuariosPorCID] = useState([]);
  const [perfilPorEstabelecimento, setPerfilPorEstabelecimento] = useState([]);
  const [panoramaGeral, setPanoramaGeral] = useState(null);
  const [nomeUltimoMes, setNomeUltimoMes] = useState('');
  const [filtroEstabelecimentoCID, setFiltroEstabelecimentoCID] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroCompetenciaCID, setFiltroCompetenciaCID] = useState(FILTRO_PERIODO_DEFAULT);
  const [filtroEstabelecimentoGenero, setFiltroEstabelecimentoGenero] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroCompetenciaGenero, setFiltroCompetenciaGenero] = useState(FILTRO_PERIODO_DEFAULT);
  const [filtroEstabelecimentoRacaCor, setFiltroEstabelecimentoRacaCor] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroCompetenciaRacaCor, setFiltroCompetenciaRacaCor] = useState(FILTRO_PERIODO_DEFAULT);
  const [filtroEstabelecimentoUsuariosAtivos, setFiltroEstabelecimentoUsuariosAtivos] = useState(FILTRO_ESTABELECIMENTO_DEFAULT);
  const [filtroCompetenciaUsuariosAtivos, setFiltroCompetenciaUsuariosAtivos] = useState(FILTRO_PERIODO_DEFAULT);
  const [filtroPeriodoCardsETabela, setFiltroPeriodoCardsETabela] = useState(FILTRO_PERIODO_DEFAULT);
  const [loadingCID, setLoadingCID] = useState(false);
  const [loadingGenero, setLoadingGenero] = useState(false);
  const [loadingCondicao, setLoadingCondicao] = useState(false);
  const [loadingRaca, setLoadingRaca] = useState(false);
  const [loadingCardsETabela, setLoadingCardsETabela] = useState(true);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      getEstabelecimentos(session?.user.municipio_id_ibge, 'usuarios_ativos_perfil')
        .then((dados) => setEstabelecimentos(dados));

      getPeriodos(session?.user.municipio_id_ibge, 'usuarios_ativos_perfil')
        .then((dados) => setCompetencias(dados));

      obterPerfilUsuariosPorEstabelecimento({
        municipioIdSus: session?.user.municipio_id_ibge,
        estabelecimentos: 'Todos',
        periodos: 'Último período',
        estabelecimento_linha_perfil: 'Todos',
        estabelecimento_linha_idade: 'Todos',
      }).then((dadoFiltrado) => setNomeUltimoMes(dadoFiltrado[0].nome_mes));
    }
  }, [session?.user.municipio_id_ibge]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCID(true);

      getUsuariosAtivosPorCID(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoCID.value,
        filtroCompetenciaCID.value
      ).then((dadosFiltrados) => {
        setUsuariosPorCID(dadosFiltrados);
        setLoadingCID(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoCID.value, filtroCompetenciaCID.value]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCondicao(true);

      getUsuariosAtivosPorCondicao(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoUsuariosAtivos.value,
        filtroCompetenciaUsuariosAtivos.value
      ).then((dadosFiltrados) => {
        setUsuariosPorCondicao(dadosFiltrados);
        setLoadingCondicao(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoUsuariosAtivos.value, filtroCompetenciaUsuariosAtivos.value]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingGenero(true);

      getUsuariosAtivosPorGeneroEIdade(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoGenero.value,
        filtroCompetenciaGenero.value
      ).then((dadosFiltrados) => {
        setUsuariosPorGeneroEIdade(dadosFiltrados);
        setLoadingGenero(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoGenero.value, filtroCompetenciaGenero.value]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingRaca(true);

      getUsuariosAtivosPorRacaECor(
        session?.user.municipio_id_ibge,
        filtroEstabelecimentoRacaCor.value,
        filtroCompetenciaRacaCor.value
      ).then((dadosFiltrados) => {
        setUsuariosPorRacaECor(dadosFiltrados);
        setLoadingRaca(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroEstabelecimentoRacaCor.value, filtroCompetenciaRacaCor.value]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      setLoadingCardsETabela(true);

      obterPerfilUsuariosPorEstabelecimento({
        municipioIdSus: session?.user.municipio_id_ibge,
        periodos: filtroPeriodoCardsETabela.value,
        estabelecimento_linha_perfil: 'Todos',
        estabelecimento_linha_idade: 'Todos',
      }).then((dadosFiltrados) => {
        const dadosPorEstabelecimento = dadosFiltrados.filter((item) => item.estabelecimento !== 'Todos');
        const totalEstabelecimentos = dadosFiltrados.find((item) => item.estabelecimento === 'Todos');

        setPanoramaGeral(totalEstabelecimentos);
        setPerfilPorEstabelecimento(dadosPorEstabelecimento);
        setLoadingCardsETabela(false);
      });
    }
  }, [session?.user.municipio_id_ibge, filtroPeriodoCardsETabela.value]);
  const obterPeriodoExtensoPerfilPorEstabelecimento = useCallback(() => {
    const { nome_mes: mes, competencia } = perfilPorEstabelecimento[0];
    const [ano] = `${competencia}`.split('-');

    return `${mes} de ${ano}`;
  }, [perfilPorEstabelecimento]);

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
        titulo="<strong>Perfil do usuário</strong>"
      />

      <GraficoInfo
        titulo='Perfil dos usuários ativos'
        descricao='Quantitativo de usuários com RAAS ou BPA movimentada nos últimos meses (exceto acolhimento inicial).'
        tooltip='Usuários ativos: Usuários que tiveram algum procedimento registrado em BPA-i ou RAAS (exceto acolhimento inicial) nos três meses anteriores ao mês de referência.
        Usuários inativos: Usuários que não tiveram nenhum procedimento registrado no serviço há mais de 3 meses.'
      />

      { nomeUltimoMes &&
        <GraficoInfo
          descricao={ `Última competência disponível: ${nomeUltimoMes}` }
        />
      }

      <GraficoInfo
        titulo='Panorama geral'
      />

      { competencias.length !== 0 &&
        <FiltroCompetencia
          width='50%'
          dados={ competencias }
          valor={ filtroPeriodoCardsETabela }
          setValor={ setFiltroPeriodoCardsETabela }
          isMulti={ false }
          label='Competência'
        />
      }

      { loadingCardsETabela
        ? <Spinner theme='ColorSM' />
        : <Grid12Col
          proporcao='4-4-4'
          items={ [
            <CardInfoTipoA
              key={ `${panoramaGeral.id}-${panoramaGeral.ativos_3meses}` }
              fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
              indicador={ panoramaGeral.ativos_3meses }
              indice={ panoramaGeral.dif_ativos_3meses_anterior }
              indiceDescricao='últ. mês'
              titulo='Usuários ativos'
              tooltip='Usuários que tiveram algum procedimento registrado em BPA-i ou RAAS (exceto acolhimento inicial) nos três meses anteriores ao mês de referência'
            />,
            <CardInfoTipoA
              key={ `${panoramaGeral.id}-${panoramaGeral.ativos_mes}` }
              fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
              indicador={ panoramaGeral.ativos_mes }
              indice={ panoramaGeral.dif_ativos_mes_anterior }
              indiceDescricao='últ. mês'
              titulo='Frequentaram no mês'
              tooltip='Usuários que tiveram algum procedimento registrado em BPA-i ou RAAS (exceto acolhimento inicial) durante o mês de referÊncia'
            />,
            <CardInfoTipoA
              key={ `${panoramaGeral.id}-${panoramaGeral.tornandose_inativos}` }
              fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
              indicador={ panoramaGeral.tornandose_inativos }
              indice={ panoramaGeral.dif_tornandose_inativos_anterior }
              indiceDescricao='últ. mês'
              titulo='Tornaram-se inativos'
              tooltip='Usuários que, no mês de referência, completaram três meses sem ter procedimentos registrados em BPA-i ou RAAS (exceto acolhimento inicial)'
            />
          ] }
        />
      }

      <GraficoInfo
        titulo='Detalhamento por estabelecimento'
        descricao={ loadingCardsETabela
          ? ''
          :`Dados de ${obterPeriodoExtensoPerfilPorEstabelecimento()}`
        }
      />

      { loadingCardsETabela
        ? <Spinner theme='ColorSM' />
        : <TabelaDetalhamentoPorCaps
          usuariosPorCaps={ perfilPorEstabelecimento }
        />
      }

      <div className={ styles.MensagemTabela }>
        * Estabelecimentos com valores zerados não aparecerão na tabela
      </div>

      <GraficoInfo
        titulo='CID dos usuários ativos'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { usuariosPorCID
        && competencias.length !== 0
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
                dados = {competencias}
                valor = {filtroCompetenciaCID}
                setValor = {setFiltroCompetenciaCID}
                isMulti = {false}
                label = {'Competência'}
              />
            </div>

            <div className={ styles.GraficoCIDContainer }>
              <GraficoDonut
                dados={ usuariosPorCID }
                propriedades={ {
                  nome: 'usuario_condicao_saude',
                  quantidade: 'ativos_3meses'
                } }
                loading={ loadingCID }
              />

              <TabelaGraficoDonut
                labels={ {
                  colunaHeader: 'Grupo de diagnósticos',
                  colunaQuantidade: 'Usuários ativos',
                } }
                propriedades={ {
                  nome: 'usuario_condicao_saude',
                  quantidade: 'ativos_3meses'
                } }
                data={ usuariosPorCID }
                mensagemDadosZerados='Sem usuários nessa competência'
              />
            </div>
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Gênero e faixa etária'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { usuariosPorGeneroEIdade
        && competencias.length !== 0
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
                dados = {competencias}
                valor = {filtroCompetenciaGenero}
                setValor = {setFiltroCompetenciaGenero}
                isMulti = {false}
                label = {'Competência'}
              />
            </div>
            <GraficoGeneroPorFaixaEtaria
              dados = {usuariosPorGeneroEIdade}
              labels={{
                eixoY: 'Usuários ativos'
              }}
              loading = {loadingGenero}
              propriedades={{
                faixaEtaria: 'usuario_faixa_etaria',
                sexo: 'usuario_sexo',
                quantidade: 'ativos_3meses',
              }}
            />
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Usuários ativos'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { usuariosPorCondicao
        && competencias.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoUsuariosAtivos}
                setValor = {setFiltroEstabelecimentoUsuariosAtivos}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {competencias}
                valor = {filtroCompetenciaUsuariosAtivos}
                setValor = {setFiltroCompetenciaUsuariosAtivos}
                isMulti = {false}
                label = {'Competência'}
              />
            </div>

            <div className={ styles.GraficosUsuariosAtivosContainer }>
              <div className={ styles.GraficoUsuariosAtivos }>
                <GraficoCondicaoUsuarios
                  dados={ usuariosPorCondicao}
                  propriedades={ {
                    nome: 'usuario_abuso_substancias' ,
                    quantidade: 'ativos_3meses'
                  } }
                  loading={ loadingCondicao }
                  textoTooltip='Fazem uso de substâncias psicoativas?'
                  titulo='Fazem uso de substâncias psicoativas?'
                />
              </div>

              <div className={ styles.GraficoUsuariosAtivos }>
                <GraficoCondicaoUsuarios
                  dados={ usuariosPorCondicao}
                  propriedades={ {
                    nome: 'usuario_situacao_rua' ,
                    quantidade: 'ativos_3meses'
                  } }
                  loading={ loadingCondicao }
                  textoTooltip='Estão em situação de rua?'
                  titulo='Estão em situação de rua?'
                />
              </div>
            </div>
          </>
        )
        : <Spinner theme='ColorSM' />
      }

      <GraficoInfo
        titulo='Raça/Cor*'
        fonte='Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov'
      />

      { usuariosPorRacaECor
        && competencias.length !== 0
        && estabelecimentos.length !== 0
        ? (
          <>
            <div className={ styles.Filtros }>
              <FiltroTexto
                width={'50%'}
                dados = {estabelecimentos}
                valor = {filtroEstabelecimentoRacaCor}
                setValor = {setFiltroEstabelecimentoRacaCor}
                label = {'Estabelecimento'}
                propriedade = {'estabelecimento'}
              />
              <FiltroCompetencia
                width={'50%'}
                dados = {competencias}
                valor = {filtroCompetenciaRacaCor}
                setValor = {setFiltroCompetenciaRacaCor}
                isMulti = {false}
                label = {'Competência'}
              />
            </div>
            <GraficoRacaECor
              dados = {usuariosPorRacaECor}
              textoTooltip={'Usuários ativos'}
              loading = {loadingRaca}
              propriedades={{
                racaCor: 'usuario_raca_cor',
                quantidade: 'ativos_3meses',
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

export default PerfilUsuario;
