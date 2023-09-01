import {CardIndicadorDescricao, CardInternacaoStatus, CardPeriodosInternacao, CardsGridInternacao, CardInfoTipoA, CardInfoTipoC, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto} from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {FiltroCompetencia} from '../../../components/Filtros'
import { getCAPSAcolhimentoNoturno, getInternacoesRapsAltas, getInternacoesRapsAdmissoes, getInternacoesRapsAltas12m } from "../../../requests/cuidado-compartilhado";
const FILTRO_PERIODO_MULTI_DEFAULT = [
  { value: 'Último período', label: 'Último período' },
];
const RapsHospitalar = ({ }) => {
  const { data: session } = useSession();
  const [CAPSAcolhimentoNoturno, setCAPSAcolhimentoNoturno] = useState();
  const [InternacoesRapsAdmissoes, setInternacoesRapsAdmissoes] = useState();
  const [InternacoesRapsAltas12m, setInternacoesRapsAltas12m] = useState();
  const [InternacoesRapsAltas, setInternacoesRapsAltas] = useState([]);
  const [periodosECompetencias, setPeriodosECompetencias] = useState([]);
  const [filtroPeriodoInternacoesRapsAltas12m, setFiltroPeriodoInternacoesRapsAltas12m] = useState([FILTRO_PERIODO_MULTI_DEFAULT]);
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
          console.log(dados);
          setInternacoesRapsAltas(dados);
          const periodosECompetencias = dados.map(item => ({
            periodo: item.periodo,
            competencia: item.competencia 
          }));
          setPeriodosECompetencias(periodosECompetencias);
          console.log(periodosECompetencias); 
        });
    }
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

      { InternacoesRapsAltas12m
        ? <GraficoInfo
          titulo={'Usuários que foram atendidos na RAPS antes ou após a internação'}
          descricao={ 'Atendimentos ocorridos nos 6 meses anteriores à internação e no mês seguinte após a alta. Atendimentos ocorridos nos 6 meses anteriores à internação e no mês seguinte após a alta.'}
          fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS - Elaboração Impulso Gov"
        />
        : <Spinner theme="ColorSM" />
      }
      <CardsGridInternacao
        cardsArray={ [
          <>
            { InternacoesRapsAltas12m
              ?<CardInternacaoStatus
                antes={{status:false, descricao:'Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta'}}
                depois={{status:false, descricao:'Não foram atendidos nem no mês da alta, nem no mês seguinte'}}></CardInternacaoStatus>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardInternacaoStatus
                antes={{status:true, descricao:'Foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta'}}
                depois={{status:false, descricao:'Não foram atendidos nem no mês da alta, nem no mês seguinte'}}></CardInternacaoStatus>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ? <CardInternacaoStatus
                antes={{status:true, descricao:'Foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta'}}
                depois={{status:true, descricao:'Foram atendidos nem no mês da alta, nem no mês seguinte'}}></CardInternacaoStatus>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardInternacaoStatus
                antes={{status:false, descricao:'Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta'}}
                depois={{status:true, descricao:'Foram atendidos nem no mês da alta, nem no mês seguinte'}}></CardInternacaoStatus>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardPeriodosInternacao
                periodo={ 'Anual'}
                descricao={ 'Internações finalizadas entre agosto de 2021 e julho de 2022.' }></CardPeriodosInternacao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ InternacoesRapsAltas12m.altas_atendimento_raps_antes_nao_apos_nao }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ InternacoesRapsAltas12m.altas_atendimento_raps_antes_sim_apos_nao }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ InternacoesRapsAltas12m.altas_atendimento_raps_antes_sim_apos_sim }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ InternacoesRapsAltas12m.altas_atendimento_raps_antes_nao_apos_sim }
                descricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardPeriodosInternacao
                periodo={ 'Mensal'}
                descricao={ 'Internações finalizadas no mês selecionado abaixo:' }
                filtro = {
                  <FiltroCompetencia
                    width={'100%'}
                    dados = {periodosECompetencias}
                    valor = {filtroPeriodoInternacoesRapsAltas12m}
                    setValor = {setFiltroPeriodoInternacoesRapsAltas12m}
                    isMulti
                  />
                }
              ></CardPeriodosInternacao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ 5}
                indicadorDescricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ 5 }
                indicadorDescricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ 5 }
                indicadorDescricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ?<CardIndicadorDescricao
                indicador={ 5 }
                indicadorDescricao={ 'Usuários' }></CardIndicadorDescricao>
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
      />


      {
        // <>
        //   <GraficoInfo
        //     descricao={ `Internações finalizadas em ${InternacoesRapsAltas["periodo"]} .` }
        //     fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS - Elaboração Impulso Gov"
        //     titulo="Usuários que foram atendidos na RAPS antes ou após a internação - MENSAL"
        //   />
        //   <div className={ styles.Filtro }>
        //     {/* <Select { ...getPropsFiltroCompetencia(InternacoesRapsAltas) } /> */}
        //   </div>     
        //   <Grid12Col
        //     items={ [
        //       <>
        //           <CardInfoTipoC
        //             descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
        //             indicador={ InternacoesRapsAltas["altas_atendimento_raps_antes_nao_apos_nao"] }
        //             indicadorDescricao="Usuários"
        //           />
        //       </>,
        //       <>
        //           <CardInfoTipoC
        //             descricao="Foram atendidos na RAPS nos 6 meses anteriores à internação mas não foram atendidos após a alta"
        //             indicador={ InternacoesRapsAltas["altas_atendimento_raps_antes_sim_apos_nao"] }
        //             indicadorDescricao="Usuários"
        //             statusAntes
        //           />
        //       </>,
        //       <>
        //         <CardInfoTipoC
        //           descricao="Foram atendidos na RAPS nos 6 meses anteriores à internação e após a alta"
        //           indicador={ InternacoesRapsAltas["altas_atendimento_raps_antes_sim_apos_sim"] }
        //           indicadorDescricao="Usuários"
        //           statusAntes
        //           statusDepois
        //         />
        //       </>,
        //       <>
        //           <CardInfoTipoC
        //             descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação mas foram atendidos após a alta"
        //             indicador={ InternacoesRapsAltas["altas_atendimento_raps_antes_nao_apos_sim"] }
        //             indicadorDescricao="Usuários"
        //             statusDepois
        //           />
        //       </>,
        //     ] }
        //     proporcao="3-3-3-3"
        //   /> 
        // </>
      }



      <GraficoInfo
        descricao="<strong>Atenção:</strong> os valores acima são aproximados, já que a conexão entre registros ambulatoriais e hospitalares do SUS a partir de dados abertos (não identificados) está sujeita a pequenas imprecisões."
      />

      { InternacoesRapsAltas12m
        ? <GraficoInfo
          descricao={ `Iniciadas entre ${InternacoesRapsAltas12m["a_partir_de_mes"]} de ${InternacoesRapsAltas12m["a_partir_de_ano"]} e ${InternacoesRapsAltas12m["ate_mes"]} de ${InternacoesRapsAltas12m["ate_ano"]}` }
          fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS - Elaboração Impulso Gov"
          titulo="Novas internações e acolhimentos noturnos"
        />
        : <Spinner theme="ColorSM" />
      }

      <Grid12Col
        items={ [
          <>
            { InternacoesRapsAdmissoes
              ? <CardInfoTipoA indicador={ InternacoesRapsAdmissoes["internacoes_transtornos"] }
                titulo="Novas internações da linha geral em hospitais"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAdmissoes
              ? <CardInfoTipoA indicador={ InternacoesRapsAdmissoes["internacoes_alcool_drogas"] }
                titulo="Novas internações da linha AD em hospitais"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAdmissoes
              ? <CardInfoTipoA indicador={ InternacoesRapsAdmissoes["internacoes_total"] }
                titulo="Novas internações em hospitais - total"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { CAPSAcolhimentoNoturno
              ? <CardInfoTipoA indicador={ CAPSAcolhimentoNoturno["acolhimentos_noturnos"] }
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
