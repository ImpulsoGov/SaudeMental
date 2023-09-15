import { CardIndicadorDescricao, CardInfoTipoA, CardInternacaoStatus, CardPeriodosInternacao, CardsGridInternacao, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { FiltroCompetencia } from '../../../components/Filtros';
import { getCAPSAcolhimentoNoturno, getInternacoesRapsAdmissoes, getInternacoesRapsAltas, getInternacoesRapsAltas12m } from "../../../requests/cuidado-compartilhado";
import { FILTRO_PERIODO_DEFAULT } from "../../../constants/FILTROS";
import styles from '../cuidado-compartilhado.module.css';

const iconeSim = "https://media.graphassets.com/TrHUmoqQ12gaauujhEoS";
const iconeNao = "https://media.graphassets.com/avvXauyoTCKA3NnBWP9g";

const RapsHospitalar = ({ }) => {
  const { data: session } = useSession();
  const [capsAcolhimentoNoturno, setCAPSAcolhimentoNoturno] = useState();
  const [internacoesRapsAdmissoes, setInternacoesRapsAdmissoes] = useState();
  const [internacoesRapsAltas12m, setInternacoesRapsAltas12m] = useState();
  const [internacoesRapsAltas, setInternacoesRapsAltas] = useState([]);
  const [periodosECompetencias, setPeriodosECompetencias] = useState([]);
  const [filtroPeriodoInternacoesRapsAltas, setFiltroPeriodoInternacoesRapsAltas] = useState(FILTRO_PERIODO_DEFAULT);
  const [internacoesRapsAltasFiltradas, setInternacoesRapsAltasFiltradas] = useState([]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      getCAPSAcolhimentoNoturno(session?.user.municipio_id_ibge)
        .then(dados => setCAPSAcolhimentoNoturno(dados[0]));
      getInternacoesRapsAdmissoes(session?.user.municipio_id_ibge)
        .then(dados => setInternacoesRapsAdmissoes(dados[0]));
      getInternacoesRapsAltas12m(session?.user.municipio_id_ibge)
        .then(dados => setInternacoesRapsAltas12m(dados[0]));
      getInternacoesRapsAltas(session?.user.municipio_id_ibge)
        .then(dados => {
          setInternacoesRapsAltas(dados);
          const periodosECompetencias = dados.map(item => ({
            periodo: item.periodo,
            competencia: item.competencia,
            nome_mes:item.nome_mes
          }));
          setPeriodosECompetencias(periodosECompetencias);
        });
    }
  }, []);

  useEffect(() => {
    const filtradas = internacoesRapsAltas.filter(item => item.periodo === filtroPeriodoInternacoesRapsAltas.value);
    setInternacoesRapsAltasFiltradas(filtradas);
  }, [internacoesRapsAltas, filtroPeriodoInternacoesRapsAltas]);

  const obterPeriodoPorExtenso = useCallback((dados, periodo) => {
    const { nome_mes: mes, competencia } = dados.find((dado) => dado.periodo === periodo);
    const [ano] = `${competencia}`.split('-');

    return `${mes} de ${ano}`;
  }, []);

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        botao={{
          label: '',
          url: ''
        }}
        titulo="<strong>Internações finalizadas desde o início do ano</strong>"
      />

      <GraficoInfo
        tooltip='São consideradas as internações de munícipes em UPAs e hospitais gerais ou psiquiátricos, vinculados a qualquer esfera federativa, desde que o tipo de leito, o procedimento principal ou o CID diagnóstico sejam referentes a questões de saúde mental.
        <br/>
        <strong>Internações ocorridas "Antes"</strong> incluem pessoas internadas com acompanhamento prévio na RAPS, com registros de ações psicossociais (RAAS) ou boletins de produção ambulatorial (BPA) nos 6 meses anteriores à internação.
        <br/>
        <strong>Internações ocorridas "Depois"</strong> abrangem egressos da internação na rede hospitalar com altas relacionadas saúde mental e registros na RAPS de ações psicossociais (RAAS) ou boletins de produção ambulatorial (BPA) no mesmo mês da alta ou no mês seguinte.'
        titulo={'Usuários que foram atendidos na RAPS antes ou após a internação'}
        descricao={ 'Internações em saúde mental em qualquer unidade hospitalar ou UPA, classificados por histórico de atendimento do usuário na RAPS nos 6 meses anteriores à internação e/ou no mês seguinte após a alta.'}
        fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS - Elaboração Impulso Gov"
      />

      <CardsGridInternacao
        cardsArray={ [
          <>
            <CardInternacaoStatus
              icones={{ sim: iconeSim, nao: iconeNao }}
              antes={{status:false, descricao:'Não atendidos'}}
              depois={{status:false, descricao:'e nem'}}></CardInternacaoStatus>
          </>,
          <>
            <CardInternacaoStatus
              icones={{ sim: iconeSim, nao: iconeNao }}
              antes={{status:true, descricao:'Atendidos'}}
              depois={{status:false, descricao:'mas não'}}></CardInternacaoStatus>
          </>,
          <>
            <CardInternacaoStatus
              icones={{ sim: iconeSim, nao: iconeNao }}
              antes={{status:true, descricao:'Atendidos'}}
              depois={{status:true, descricao:'e também'}}></CardInternacaoStatus>
          </>,
          <>
            <CardInternacaoStatus
              icones={{ sim: iconeSim, nao: iconeNao }}
              antes={{status:false, descricao:'Não atendidos'}}
              depois={{status:true, descricao:'mas atendidos'}}></CardInternacaoStatus>
          </>,
          <>
            <CardPeriodosInternacao
              periodo={ 'Anual'}
              descricao={ internacoesRapsAltas12m && `Internações finalizadas entre ${internacoesRapsAltas12m.a_partir_de_mes} de ${internacoesRapsAltas12m.a_partir_de_ano} e ${internacoesRapsAltas12m.ate_mes} de ${internacoesRapsAltas12m.ate_ano}` }></CardPeriodosInternacao>
          </>,
          <>
            { internacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ internacoesRapsAltas12m.altas_atendimento_raps_antes_nao_apos_nao }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ internacoesRapsAltas12m.altas_atendimento_raps_antes_sim_apos_nao }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ internacoesRapsAltas12m.altas_atendimento_raps_antes_sim_apos_sim }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ internacoesRapsAltas12m.altas_atendimento_raps_antes_nao_apos_sim }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            <CardPeriodosInternacao
              periodo={ 'Mensal'}
              descricao={ 'Internações finalizadas no mês selecionado abaixo:' }
              filtro = {
                <FiltroCompetencia
                  width={'100%'}
                  dados = {periodosECompetencias}
                  valor = {filtroPeriodoInternacoesRapsAltas}
                  setValor = {setFiltroPeriodoInternacoesRapsAltas}
                />
              }
            ></CardPeriodosInternacao>
          </>,
          <>
            { internacoesRapsAltasFiltradas.length != 0
              ?<CardIndicadorDescricao
                indicador={ internacoesRapsAltasFiltradas[0].altas_atendimento_raps_antes_nao_apos_nao}
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAltasFiltradas.length != 0
              ?<CardIndicadorDescricao
                indicador={ internacoesRapsAltasFiltradas[0].altas_atendimento_raps_antes_sim_apos_nao}
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAltasFiltradas.length != 0
              ?<CardIndicadorDescricao
                indicador={ internacoesRapsAltasFiltradas[0].altas_atendimento_raps_antes_sim_apos_sim }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAltasFiltradas.length != 0
              ?<CardIndicadorDescricao
                indicador={ internacoesRapsAltasFiltradas[0].altas_atendimento_raps_antes_nao_apos_sim}
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
      />

      {internacoesRapsAltas.length !== 0 &&
        <div className={ styles.Mensagem }>
          {`Última competência disponível: ${obterPeriodoPorExtenso(internacoesRapsAltas, 'Último período')}`}
        </div>
      }

      <GraficoInfo
        descricao="<strong>Atenção:</strong> os valores acima são aproximados, já que a conexão entre registros ambulatoriais e hospitalares do SUS a partir de dados abertos (não identificados) está sujeita a pequenas imprecisões."
      />

      { internacoesRapsAltas12m
        ? <GraficoInfo
          descricao={ `Iniciadas entre ${internacoesRapsAltas12m["a_partir_de_mes"]} de ${internacoesRapsAltas12m["a_partir_de_ano"]} e ${internacoesRapsAltas12m["ate_mes"]} de ${internacoesRapsAltas12m["ate_ano"]}` }
          fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS - Elaboração Impulso Gov"
          titulo="Novas internações e acolhimentos noturnos"
        />
        : <Spinner theme="ColorSM" />
      }

      <Grid12Col
        items={ [
          <>
            { internacoesRapsAdmissoes
              ? <CardInfoTipoA indicador={ internacoesRapsAdmissoes["internacoes_transtornos"] }
                titulo="Novas internações da linha geral em hospitais"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAdmissoes
              ? <CardInfoTipoA indicador={ internacoesRapsAdmissoes["internacoes_alcool_drogas"] }
                titulo="Novas internações da linha AD em hospitais"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAdmissoes
              ? <CardInfoTipoA indicador={ internacoesRapsAdmissoes["internacoes_total"] }
                titulo="Novas internações em hospitais - total"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { capsAcolhimentoNoturno
              ? <CardInfoTipoA indicador={ capsAcolhimentoNoturno["acolhimentos_noturnos"] }
                titulo="Quantidade de usuários que passaram por acolhimentos noturnos em CAPS"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
        proporcao="3-3-3-3"
      />
    </div>
  );
};

export default RapsHospitalar;
