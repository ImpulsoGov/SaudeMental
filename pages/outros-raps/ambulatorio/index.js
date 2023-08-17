import { GraficoInfo, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { API_URL } from "../../../constants/API_URL";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Ambulatorio = () => {
  const { data: session } = useSession();
  // const [internacoesRapsAdmissoesVertical, setInternacoesRapsAdmissoesVertical] = useState([]);
  // const [internacoesRapsAltasVertical, setInternacoesRapsAltasVertical] = useState([]);
  // const [internacoesRapsAdmissoes12m, setInternacoesRapsAdmissoes12m] = useState();
  // const [internacoesRapsAltas12m, setInternacoesRapsAltas12m] = useState();
  // const [encaminhamentosApsCapsVertical, setEncaminhamentosApsCapsVertical] = useState([]);
  // const [encaminhamentosApsCapsHorizontal, setEncaminhamentosApsCapsHorizontal] = useState();
  // const [encaminhamentosApsVertical, setEncaminhamentosApsVertical] = useState([]);
  // const [encaminhamentosApsHorizontal, setEncaminhamentosApsHorizontal] = useState();

  // const [matriciamentosPorMunicipio, setMatriciamentosPorMunicipio] = useState();

  // useEffect(() => {
  //   if (session?.user.municipio_id_ibge) {
  //     const getRequestOptions = { method: 'GET', redirect: 'follow' };

  //     const urlInternacoesRapsAdmissoes = API_URL
  //       + "saude-mental/internacoes/raps/admissoes/resumo/vertical?municipio_id_sus="
  //       + session?.user.municipio_id_ibge;

  //     fetch(urlInternacoesRapsAdmissoes, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setInternacoesRapsAdmissoesVertical(result))
  //       .catch(error => console.log('error', error));

  //     const urlInternacoesRapsAltas = API_URL
  //       + "saude-mental/internacoes/raps/altas/resumo/vertical?municipio_id_sus="
  //       + session?.user.municipio_id_ibge;

  //     fetch(urlInternacoesRapsAltas, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setInternacoesRapsAltasVertical(result))
  //       .catch(error => console.log('error', error));

  //     const urlEncaminhamentosApsCapsVertical = API_URL
  //       + "saude-mental/encaminhamentos/aps/caps/resumo?municipio_id_sus="
  //       + session?.user.municipio_id_ibge
  //       + "&sentido=vertical";

  //     fetch(urlEncaminhamentosApsCapsVertical, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setEncaminhamentosApsCapsVertical(result))
  //       .catch(error => console.log('error', error));

  //     const urlEncaminhamentosApsVertical = API_URL
  //       + "saude-mental/encaminhamentos/aps/especializada/resumo?municipio_id_sus="
  //       + session?.user.municipio_id_ibge
  //       + "&sentido=vertical";

  //     fetch(urlEncaminhamentosApsVertical, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setEncaminhamentosApsVertical(result))
  //       .catch(error => console.log('error', error));

  //     const urlMatriciamentosPorMunicipio = API_URL
  //       + "saude-mental/matriciamentos/municipio?municipio_id_sus="
  //       + session?.user.municipio_id_ibge;

  //     fetch(urlMatriciamentosPorMunicipio, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setMatriciamentosPorMunicipio(result[0]))
  //       .catch(error => console.log('error', error));

  //     const urlEncaminhamentosApsCapsHorizontal = API_URL
  //       + "saude-mental/encaminhamentos/aps/caps/resumo?municipio_id_sus="
  //       + session?.user.municipio_id_ibge;

  //     fetch(urlEncaminhamentosApsCapsHorizontal, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setEncaminhamentosApsCapsHorizontal(result[0]))
  //       .catch(error => console.log('error', error));

  //     const urlEncaminhamentosApsHorizontal = API_URL
  //       + "saude-mental/encaminhamentos/aps/especializada/resumo?municipio_id_sus="
  //       + session?.user.municipio_id_ibge;

  //     fetch(urlEncaminhamentosApsHorizontal, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setEncaminhamentosApsHorizontal(result[0]))
  //       .catch(error => console.log('error', error));

  //     const urlinternacoesRapsAdmissoes12m = API_URL
  //       + "saude-mental/internacoes/raps/admissoes/resumo/12m?municipio_id_sus="
  //       + session?.user.municipio_id_ibge;

  //     fetch(urlinternacoesRapsAdmissoes12m, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setInternacoesRapsAdmissoes12m(result[0]))
  //       .catch(error => console.log('error', error));

  //     const urlinternacoesRapsAltas12m = API_URL
  //       + "saude-mental/internacoes/raps/altas/resumo/12m?municipio_id_sus="
  //       + session?.user.municipio_id_ibge;

  //     fetch(urlinternacoesRapsAltas12m, getRequestOptions)
  //       .then(response => response.json())
  //       .then(result => setInternacoesRapsAltas12m(result[0]))
  //       .catch(error => console.log('error', error));
  //   }
  // }, []);

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
        titulo="<strong>Em breve.</strong>"
      />

      {/* <GraficoInfo
        titulo="Referência de Saúde Mental"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Total de atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        tooltip="Indicador é calculado a partir de divisão do total de procedimentos registradas pelo total de horas de trabalho estabelecidas em contrato. De tal modo, dados podem apresentar valores subestimados no caso de férias, licenças, feriados e números de finais de semana no mês."
      />

      <GraficoInfo
        titulo="Atendimentos por horas trabalhadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        tooltip="Indicador é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, números de maior número de finais de semana no mês."
      />

      <GraficoInfo
        titulo="Pirâmide etária de atendidos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos por profissional"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      /> */}
    </div>
  );
};

export default Ambulatorio;
