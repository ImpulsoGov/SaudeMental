import { GraficoInfo, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import { API_URL } from "../../../constants/API_URL";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAtendimentosTotal, getAtendidos } from "../../../requests/outros-raps"

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Ambulatorio = () => {
  const { data: session } = useSession();
  const [atendimentosTotal, setAtendimentosTotal] = useState([]);
  const [atendimentosPorHorasTrabalhadas, setAtendimentosPorHorasTrabalhadas] = useState([]);
  const [atendidos, setAtendidos] = useState([]);
  // const [internacoesRapsAdmissoesVertical, setInternacoesRapsAdmissoesVertical] = useState([]);
  // const [internacoesRapsAltasVertical, setInternacoesRapsAltasVertical] = useState([]);
  // const [internacoesRapsAdmissoes12m, setInternacoesRapsAdmissoes12m] = useState();
  // const [internacoesRapsAltas12m, setInternacoesRapsAltas12m] = useState();
  // const [encaminhamentosApsCapsVertical, setEncaminhamentosApsCapsVertical] = useState([]);
  // const [encaminhamentosApsCapsHorizontal, setEncaminhamentosApsCapsHorizontal] = useState();
  // const [encaminhamentosApsVertical, setEncaminhamentosApsVertical] = useState([]);
  // const [encaminhamentosApsHorizontal, setEncaminhamentosApsHorizontal] = useState();

  // const [matriciamentosPorMunicipio, setMatriciamentosPorMunicipio] = useState();

  useEffect(() => {
    if(session?.user.municipio_id_ibge) {
      getAtendimentosTotal(session?.user.municipio_id_ibge)
        .then(dados =>{
          console.log(dados)
          setAtendimentosTotal(dados)
        });
      getAtendidos(session?.user.municipio_id_ibge)
        .then(dados =>{
          console.log(dados)
          setAtendidos(dados)
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
        titulo="<strong>Ambulatório de saúde mental</strong>"
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
