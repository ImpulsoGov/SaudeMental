import { CardInfoTipoA, CardInfoTipoC, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { API_URL } from "../../../constants/API_URL";

const RapsHospitalar = ({ }) => {
  const getRequestOptions = { method: 'GET', redirect: 'follow' };
  const { data: session } = useSession();
  const [CAPSAcolhimentoNorturno, setCAPSAcolhimentoNorturno] = useState();
  const [InternacoesRapsAdmissoes, setInternacoesRapsAdmissoes] = useState();
  const [InternacoesRapsAltas12m, setInternacoesRapsAltas12m] = useState();
  const [InternacoesRapsAltas, setInternacoesRapsAltas] = useState([]);
  const [filtroCompetencia, setFiltroCompetencia] = useState({
    value: "Último período", label: "Último período"
  });

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      const urlCAPSAcolhimentoNoturno = API_URL + "saude-mental/atencao_hospitalar/noturno?municipio_id_sus=" + session?.user.municipio_id_ibge;
      const urlInternacoesRapsAdmissoes = API_URL + "saude-mental/internacoes/raps/admissoes/resumo/12m?municipio_id_sus=" + session?.user.municipio_id_ibge;
      const urlInternacoesRapsAltas = API_URL + "saude-mental/atencao_hospitalar/altas?municipio_id_sus=" + session?.user.municipio_id_ibge;
      const urlInternacoesRapsAltas12m = API_URL + "saude-mental/internacoes/raps/altas/resumo/12m?municipio_id_sus=" + session?.user.municipio_id_ibge;

      fetch(urlCAPSAcolhimentoNoturno, getRequestOptions)
        .then(response => response.json())
        .then(result => setCAPSAcolhimentoNorturno(result[0]))
        .catch(error => console.log('error', error));

      fetch(urlInternacoesRapsAdmissoes, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAdmissoes(result[0]))
        .catch(error => console.log('error', error));

      fetch(urlInternacoesRapsAltas12m, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAltas12m(result[0]))
        .catch(error => console.log('error', error));

      fetch(urlInternacoesRapsAltas, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAltas(result[0]))
        .catch(error => console.log('error', error));
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
          descricao={ `Internações finalizadas entre ${InternacoesRapsAltas12m["a_partir_de_mes"]} de ${InternacoesRapsAltas12m["a_partir_de_ano"]} e ${InternacoesRapsAltas12m["ate_mes"]} de ${InternacoesRapsAltas12m["ate_ano"]}` }
          fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS - Elaboração Impulso Gov"
          titulo="Usuários que foram atendidos na RAPS antes ou após a internação - ANUAL"
        />
        : <Spinner theme="ColorSM" />
      }

      <Grid12Col
        items={ [
          <>
            { InternacoesRapsAltas12m
              ? <CardInfoTipoC
                descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
                indicador={ InternacoesRapsAltas12m["altas_atendimento_raps_antes_nao_apos_nao"] }
                indicadorDescricao="Usuários"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ? <CardInfoTipoC
                descricao="Foram atendidos na RAPS nos 6 meses anteriores à internação mas não foram atendidos após a alta"
                indicador={ InternacoesRapsAltas12m["altas_atendimento_raps_antes_sim_apos_nao"] }
                indicadorDescricao="Usuários"
                statusAntes
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ? <CardInfoTipoC
                descricao="Foram atendidos na RAPS nos 6 meses anteriores à internação e após a alta"
                indicador={ InternacoesRapsAltas12m["altas_atendimento_raps_antes_sim_apos_sim"] }
                indicadorDescricao="Usuários"
                statusAntes
                statusDepois
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { InternacoesRapsAltas12m
              ? <CardInfoTipoC
                descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação mas foram atendidos após a alta"
                indicador={ InternacoesRapsAltas12m["altas_atendimento_raps_antes_nao_apos_sim"] }
                indicadorDescricao="Usuários"
                statusDepois
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
        proporcao="3-3-3-3"
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
            { CAPSAcolhimentoNorturno
              ? <CardInfoTipoA indicador={ CAPSAcolhimentoNorturno["acolhimentos_noturnos"] }
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
