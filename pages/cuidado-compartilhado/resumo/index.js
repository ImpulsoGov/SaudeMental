import { CardInfoTipoA, CardInfoTipoB, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from "../../../constants/API_URL";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Resumo = ({ }) => {
  const { data: session } = useSession();
  const [internacoesRapsAdmissoes, setInternacoesRapsAdmissoes] = useState([]);
  const [internacoesRapsAltas, setInternacoesRapsAltas] = useState([]);
  const [encaminhamentosApsCapsVertical, setEncaminhamentosApsCapsVertical] = useState([]);
  const [encaminhamentosApsCapsHorizontal, setEncaminhamentosApsCapsHorizontal] = useState({});
  const [encaminhamentosApsVertical, setEncaminhamentosApsVertical] = useState([]);
  const [encaminhamentosApsHorizontal, setEncaminhamentosApsHorizontal] = useState({});

  const [matriciamentosPorMunicipio, setMatriciamentosPorMunicipio] = useState({});

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      const getRequestOptions = { method: 'GET', redirect: 'follow' };

      const urlInternacoesRapsAdmissoes = API_URL
        + "saude-mental/internacoes/raps/admissoes/resumo/vertical?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlInternacoesRapsAdmissoes, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAdmissoes(result))
        .catch(error => console.log('error', error));

      const urlInternacoesRapsAltas = API_URL
        + "saude-mental/internacoes/raps/altas/resumo/vertical?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlInternacoesRapsAltas, getRequestOptions)
        .then(response => response.json())
        .then(result => setInternacoesRapsAltas(result))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsCapsVertical = API_URL
        + "saude-mental/encaminhamentos/aps/caps/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge
        + "&sentido=vertical";

      fetch(urlEncaminhamentosApsCapsVertical, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsCapsVertical(result))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsVertical = API_URL
        + "saude-mental/encaminhamentos/aps/especializada/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge
        + "&sentido=vertical";

      fetch(urlEncaminhamentosApsVertical, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsVertical(result))
        .catch(error => console.log('error', error));

      const urlMatriciamentosPorMunicipio = API_URL
        + "saude-mental/matriciamentos/municipio?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlMatriciamentosPorMunicipio, getRequestOptions)
        .then(response => response.json())
        .then(result => setMatriciamentosPorMunicipio(result[0]))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsCapsHorizontal = API_URL
        + "saude-mental/encaminhamentos/aps/caps/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlEncaminhamentosApsCapsHorizontal, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsCapsHorizontal(result[0]))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsHorizontal = API_URL
        + "saude-mental/encaminhamentos/aps/especializada/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlEncaminhamentosApsHorizontal, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsHorizontal(result[0]))
        .catch(error => console.log('error', error));
    }
  }, []);

  const getPorcentagemAtendimentosNaoFeitos = (encaminhamentos) => {
    const { prop_atendimentos: propAtendimentos } = encaminhamentos
      .find(({ encaminhamento }) => encaminhamento === "Não");
    console.log("não", propAtendimentos * 100);
    return propAtendimentos * 100;
  };

  const getPorcentagemAtendimentosFeitos = (encaminhamentos) => {
    const { prop_atendimentos: propAtendimentos } = encaminhamentos
      .find(({ encaminhamento }) => encaminhamento === "Sim");
    console.log("sim", propAtendimentos * 100);
    return propAtendimentos * 100;
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Resumo</strong>"
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e CAPS"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado/aps-caps' } }
      />
      <Grid12Col
        items={ [
          <>
            { encaminhamentosApsCapsHorizontal &&
              encaminhamentosApsCapsVertical.length !== 0 &&
              <CardInfoTipoB
                key={ uuidv4() }
                descricao={ `de ${encaminhamentosApsCapsHorizontal["atendimentos_sm_aps"]} atendimentos em saúde mental na APS` }
                indicador={ encaminhamentosApsCapsHorizontal["encaminhamentos_caps"] }
                indice={ encaminhamentosApsCapsHorizontal["dif_encaminhamentos_caps_anterior"] }
                indiceDescricao="últ. mês"
                titulo={ `Encaminhamentos para CAPS no mês de ${encaminhamentosApsCapsHorizontal["nome_mes"]}` }
                tooltip="Usuários que foram encaminhados para CAPS após atendimento em saúde mental ou abuso de substâncias pela Atenção Primária em Saúde"
                porcentagemSim={ (getPorcentagemAtendimentosFeitos(encaminhamentosApsCapsVertical)) }
                porcentagemNao={ getPorcentagemAtendimentosNaoFeitos(encaminhamentosApsCapsVertical) }
              />
            }
          </>,
          <>
            { matriciamentosPorMunicipio &&
              <CardInfoTipoA
                key={ uuidv4() }
                indicador={ matriciamentosPorMunicipio["estabelecimentos_fora_meta"] }
                titulo={ `CAPS fora da meta de matriciamento em 2022 (até ${matriciamentosPorMunicipio["ate_mes"]})` }
                tooltip="CAPS que realizaram menos de dois matriciamentos por mês no ano, até o mês de referência"
              />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e Cuidado Ambulatorial"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado/aps-ambulatorio' } }
      />

      <Grid12Col
        items={ [
          <>
            { encaminhamentosApsHorizontal &&
              encaminhamentosApsVertical.length !== 0 &&
              <CardInfoTipoB
                key={ uuidv4() }
                // descricao={ `de ${encaminhamentosApsHorizontal["atendimentos_sm_aps"]} atendimentos em saúde mental na APS` }
                // indicador={ encaminhamentosApsHorizontal["encaminhamentos_especializada"] }
                // indice={ encaminhamentosApsHorizontal["dif_encaminhamentos_especializada_anterior"] }
                // indiceDescricao="últ. mês"
                // titulo={ `Encaminhamentos para cuidado ambulatorial no mês de ${encaminhamentosApsHorizontal["nome_mes"]}` }
                tooltip="Usuários que foram encaminhados para cuidado ambulatorial (incluindo referências em psicologia e outros centros de especialidades) após atendimento em saúde mental ou abuso de substâncias pela Atenção Primária em Saúde"
                porcentagemSim={ (getPorcentagemAtendimentosFeitos(encaminhamentosApsVertical)) }
                porcentagemNao={ getPorcentagemAtendimentosNaoFeitos(encaminhamentosApsVertical) }
              />
            }
          </>
        ] }
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre RAPS e Rede de Urgência e Emergência"
        fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS.- Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado/raps-hospitalar' } }
      />

      <Grid12Col
        items={ [
          <>
            { internacoesRapsAdmissoes.length !== 0 &&
              <CardInfoTipoB
                key={ uuidv4() }
                descricao="de 151 atendimentos em saúde mental na APS"
                indicador={ 63 }
                indicadorTotal={ 151 }
                titulo="Atendidos na RAPS nos últimos 6 meses antes da Internação"
                tooltip="Usuários que tiveram ao menos um procedimento RAAS registrado em serviços RAPS dentro dos 6 meses anteriores a sua internação na rede hospitalar."
              // porcentagemSim={ (getPorcentagemAtendimentosFeitos(internacoesRapsAdmissoes)) }
              // porcentagemNao={ getPorcentagemAtendimentosNaoFeitos(internacoesRapsAdmissoes) }
              />
            }
          </>,
          <>
            { internacoesRapsAltas.length !== 0 &&
              <CardInfoTipoB
                key={ uuidv4() }
                descricao="de 3 atendimentos em saúde mental na APS"
                indicador={ 0 }
                indicadorTotal={ 3 }
                titulo="Atendidos na RAPS até o mês seguinte à alta"
                tooltip="Usuários que tiveram ao menos um procedimento RAAS registrado em serviços RAPS até o mês seguinte à alta de sua internação na rede hospitalar."
              // porcentagemSim={ (getPorcentagemAtendimentosFeitos(internacoesRapsAltas)) }
              // porcentagemNao={ getPorcentagemAtendimentosNaoFeitos(internacoesRapsAltas) }
              />
            }
          </>
        ] }
      />
    </div>
  );
};

export default Resumo;
