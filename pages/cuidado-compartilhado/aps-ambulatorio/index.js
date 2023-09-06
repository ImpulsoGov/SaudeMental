import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAtendimentosTotal, getAtendidos } from "../../../requests/cuidado-compartilhado"
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getEncaminhamentosChartOptions } from "../../../helpers/getEncaminhamentosChartOptions";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ApsAmbulatorio = () => {
  const { data: session } = useSession();
  const [atendimentosTotal, setAtendimentosTotal] = useState([]);
  const [atendimentosPorHorasTrabalhadas, setAtendimentosPorHorasTrabalhadas] = useState([]);
  const [atendidos, setAtendidos] = useState([]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      getAtendimentosTotal(session?.user.municipio_id_ibge)
        .then(dados => setAtendimentosTotal(dados[0]));
        console.log(atendimentosTotal)
      getAtendidos(session?.user.municipio_id_ibge)
        .then(dados => setAtendidos(dados[0]));
        console.log(atendidos)
    }
  }, []);

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        botao={{
          label: '',
          url: ''
        }}
        titulo="<strong>Ambulatório de saúde mental</strong>"
      />

      <GraficoInfo
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        titulo="Ambulatório de saúde mental"
      />

      {
        atendimentosTotal
          ? <>
            <Grid12Col
              items={ [
                <CardInfoTipoA
                 
                />,
                <CardInfoTipoA
                  
                />,
                <CardInfoTipoA
                />,
              ] }
              proporcao="4-4-4"
            />
          </>
          : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        descricao="<strong>Atenção:</strong> o número de atendimentos no gráfico a seguir está em escala logarítmica, que reforça as variações mês a mês quando os números são pequenos, e diminui a variação aparente quando os números são muito grandes."
      />
    </div>
  );
};

export default ApsAmbulatorio;
