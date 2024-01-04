import { CardInfoTipoA, CardInfoTipoB, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';
import { API_SAUDE_MENTAL_URL } from "../../../constants/API_URL";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Resumo = () => {
  const { data: session } = useSession();
  const [internacoesRapsAdmissoesVertical, setInternacoesRapsAdmissoesVertical] = useState([]);
  const [internacoesRapsAltasVertical, setInternacoesRapsAltasVertical] = useState([]);
  const [internacoesRapsAdmissoes12m, setInternacoesRapsAdmissoes12m] = useState();
  const [internacoesRapsAltas12m, setInternacoesRapsAltas12m] = useState();
  const [encaminhamentosApsCapsVertical, setEncaminhamentosApsCapsVertical] = useState([]);
  const [encaminhamentosApsCapsHorizontal, setEncaminhamentosApsCapsHorizontal] = useState();
  const [encaminhamentosApsVertical, setEncaminhamentosApsVertical] = useState([]);
  const [encaminhamentosApsHorizontal, setEncaminhamentosApsHorizontal] = useState();

  const [matriciamentosPorMunicipio, setMatriciamentosPorMunicipio] = useState();

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      const getRequestOptions = { method: 'GET', redirect: 'follow' };

      const urlInternacoesRapsAdmissoes = API_SAUDE_MENTAL_URL
        + "saude-mental/internacoes/raps/admissoes/resumo/vertical?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlInternacoesRapsAdmissoes, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAdmissoesVertical(result))
        .catch(error => console.log('error', error));

      const urlInternacoesRapsAltas = API_SAUDE_MENTAL_URL
        + "saude-mental/internacoes/raps/altas/resumo/vertical?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlInternacoesRapsAltas, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAltasVertical(result))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsCapsVertical = API_SAUDE_MENTAL_URL
        + "saude-mental/encaminhamentos/aps/caps/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge
        + "&sentido=vertical";

      fetch(urlEncaminhamentosApsCapsVertical, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsCapsVertical(result))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsVertical = API_SAUDE_MENTAL_URL
        + "saude-mental/encaminhamentos/aps/especializada/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge
        + "&sentido=vertical";

      fetch(urlEncaminhamentosApsVertical, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsVertical(result))
        .catch(error => console.log('error', error));

      const urlMatriciamentosPorMunicipio = API_SAUDE_MENTAL_URL
        + "saude-mental/matriciamentos/municipio?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlMatriciamentosPorMunicipio, getRequestOptions)
        .then(response => response.json())
        .then(result => setMatriciamentosPorMunicipio(result[0]))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsCapsHorizontal = API_SAUDE_MENTAL_URL
        + "saude-mental/encaminhamentos/aps/caps/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlEncaminhamentosApsCapsHorizontal, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsCapsHorizontal(result[0]))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsHorizontal = API_SAUDE_MENTAL_URL
        + "saude-mental/encaminhamentos/aps/especializada/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlEncaminhamentosApsHorizontal, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsHorizontal(result[0]))
        .catch(error => console.log('error', error));

      const urlinternacoesRapsAdmissoes12m = API_SAUDE_MENTAL_URL
        + "saude-mental/internacoes/raps/admissoes/resumo/12m?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlinternacoesRapsAdmissoes12m, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAdmissoes12m(result[0]))
        .catch(error => console.log('error', error));

      const urlinternacoesRapsAltas12m = API_SAUDE_MENTAL_URL
        + "saude-mental/internacoes/raps/altas/resumo/12m?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlinternacoesRapsAltas12m, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAltas12m(result[0]))
        .catch(error => console.log('error', error));
    }
  }, [session?.user.municipio_id_ibge]);

  const getPorcentagemAtendimentosNaoFeitos = (encaminhamentos) => {
    const { prop_atendimentos: propAtendimentos } = encaminhamentos
      .find(({ encaminhamento }) => encaminhamento === "Não");

    return propAtendimentos * 100;
  };

  const getPorcentagemAtendimentosFeitos = (encaminhamentos) => {
    const { prop_atendimentos: propAtendimentos } = encaminhamentos
      .find(({ encaminhamento }) => encaminhamento === "Sim");

    return propAtendimentos * 100;
  };

  const getPorcentagemInternacoesNaoFeitas = (internacoes) => {
    const { prop_internacoes: propInternacoes } = internacoes
      .find(({ atendimento_raps_6m_antes: atendimentoRaps6mAntes }) => atendimentoRaps6mAntes === "Não");

    return propInternacoes * 100;
  };

  const getPorcentagemInternacoesFeitas = (internacoes) => {
    const { prop_internacoes: propInternacoes } = internacoes
      .find(({ atendimento_raps_6m_antes: atendimentoRaps6mAntes }) => atendimentoRaps6mAntes === "Sim");

    return propInternacoes * 100;
  };

  const getPorcentagemAltasNaoFeitas = (internacoes) => {
    const { prop_altas: propAltas } = internacoes
      .find(({ atendimento_raps_1m_apos: atendimentoRaps1mApos }) => atendimentoRaps1mApos === "Não");

    return propAltas * 100;
  };

  const getPorcentagemAltasFeitas = (internacoes) => {
    const { prop_altas: propAltas } = internacoes
      .find(({ atendimento_raps_1m_apos: atendimentoRaps1mApos }) => atendimentoRaps1mApos === "Sim");

    return propAltas * 100;
  };

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
        titulo="<strong>Resumo</strong>"
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e CAPS"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado?painel=1' } }
      />
      <Grid12Col
        items={ [
          <>
            { encaminhamentosApsCapsHorizontal &&
              encaminhamentosApsCapsVertical.length !== 0
              ? <CardInfoTipoB
                key={ uuidv1() }
                descricao={ `de ${encaminhamentosApsCapsHorizontal["atendimentos_sm_aps"]} atendimentos em saúde mental na APS` }
                indicador={ encaminhamentosApsCapsHorizontal["encaminhamentos_caps"] }
                indice={ encaminhamentosApsCapsHorizontal["dif_encaminhamentos_caps_anterior"] }
                indiceDescricao="últ. mês"
                titulo={ `Encaminhamentos para CAPS no mês de ${encaminhamentosApsCapsHorizontal["nome_mes"]}` }
                tooltip="Usuários que foram encaminhados para CAPS após atendimento em saúde mental ou abuso de substâncias pela Atenção Primária em Saúde"
                porcentagemSim={ getPorcentagemAtendimentosFeitos(encaminhamentosApsCapsVertical) }
                porcentagemNao={ getPorcentagemAtendimentosNaoFeitos(encaminhamentosApsCapsVertical) }
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { matriciamentosPorMunicipio
              ? <CardInfoTipoA
                key={ uuidv1() }
                indicador={ matriciamentosPorMunicipio["estabelecimentos_fora_meta"] }
                titulo={ `CAPS fora da meta de matriciamento em ${matriciamentosPorMunicipio["ano"]} (até ${matriciamentosPorMunicipio["ate_mes"]})` }
                tooltip="CAPS que realizaram menos de dois matriciamentos por mês no ano, até o mês de referência"
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e Cuidado Ambulatorial"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado?painel=2' } }
      />

      <Grid12Col
        items={ [
          <>
            { encaminhamentosApsHorizontal &&
              encaminhamentosApsVertical.length !== 0
              ? <CardInfoTipoB
                key={ uuidv1() }
                descricao={ `de ${encaminhamentosApsHorizontal["atendimentos_sm_aps"]} atendimentos em saúde mental na APS` }
                indicador={ encaminhamentosApsHorizontal["encaminhamentos_especializada"] }
                indice={ encaminhamentosApsHorizontal["dif_encaminhamentos_especializada_anterior"] }
                indiceDescricao="últ. mês"
                titulo={ `Encaminhamentos para cuidado ambulatorial no mês de ${encaminhamentosApsHorizontal["nome_mes"]}` }
                tooltip="Usuários que foram encaminhados para cuidado ambulatorial (incluindo referências em psicologia e outros centros de especialidades) após atendimento em saúde mental ou abuso de substâncias pela Atenção Primária em Saúde"
                porcentagemSim={ getPorcentagemAtendimentosFeitos(encaminhamentosApsVertical) }
                porcentagemNao={ getPorcentagemAtendimentosNaoFeitos(encaminhamentosApsVertical) }
              />
              : <Spinner theme="ColorSM" />
            }
          </>
        ] }
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre RAPS e Rede de Urgência e Emergência"
        fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS.- Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado?painel=3' } }
      />

      <Grid12Col
        items={ [
          <>
            { internacoesRapsAdmissoes12m &&
              internacoesRapsAdmissoesVertical.length !== 0
              ? <CardInfoTipoB
                key={ uuidv1() }
                descricao={ `das ${internacoesRapsAdmissoes12m["internacoes_total"]} internações iniciadas entre ${internacoesRapsAdmissoes12m["a_partir_de_mes"]}/${internacoesRapsAdmissoes12m["a_partir_de_ano"]} e ${internacoesRapsAdmissoes12m["ate_mes"]}/${internacoesRapsAdmissoes12m["ate_ano"]}` }
                indicador={ internacoesRapsAdmissoes12m["internacoes_atendimento_raps_antes"] }
                titulo="Atendidos na RAPS nos últimos 6 meses antes da Internação"
                tooltip="Usuários que tiveram ao menos um procedimento RAAS registrado em serviços RAPS dentro dos 6 meses anteriores a sua internação na rede hospitalar"
                porcentagemSim={ getPorcentagemInternacoesFeitas(internacoesRapsAdmissoesVertical) }
                porcentagemNao={ getPorcentagemInternacoesNaoFeitas(internacoesRapsAdmissoesVertical) }
              />
              : <Spinner theme="ColorSM" />
            }
          </>,
          <>
            { internacoesRapsAltas12m &&
              internacoesRapsAltasVertical.length !== 0
              ? <CardInfoTipoB
                key={ uuidv1() }
                descricao={ `dos ${internacoesRapsAltas12m["altas_total"]} que receberam alta entre ${internacoesRapsAltas12m["a_partir_de_mes"]}/${internacoesRapsAltas12m["a_partir_de_ano"]} e ${internacoesRapsAltas12m["ate_mes"]}/${internacoesRapsAltas12m["ate_ano"]}` }
                indicador={ internacoesRapsAltas12m["altas_atendimento_raps_1m_apos"] }
                titulo="Atendidos na RAPS até o mês seguinte à alta"
                tooltip="Usuários que tiveram ao menos um procedimento RAAS registrado em serviços RAPS até o mês seguinte à alta de sua internação na rede hospitalar."
                porcentagemSim={ getPorcentagemAltasFeitas(internacoesRapsAltasVertical) }
                porcentagemNao={ getPorcentagemAltasNaoFeitas(internacoesRapsAltasVertical) }
              />
              : <Spinner theme="ColorSM" />
            }
          </>
        ] }
      />
    </div>
  );
};

export default Resumo;
