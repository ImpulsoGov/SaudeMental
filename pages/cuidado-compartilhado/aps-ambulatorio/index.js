import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from "../../../constants/API_URL";
import { getEncaminhamentosChartOptions } from "../../../helpers/getEncaminhamentosChartOptions";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ApsAmbulatorio = () => {
  const { data: session } = useSession();
  const [encaminhamentosApsResumo, setEncaminhamentosApsResumo] = useState({});
  const [encaminhamentosAps, setEncaminhamentosAps] = useState([]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      const getRequestOptions = { method: 'GET', redirect: 'follow' };
      const urlEncaminhamentosApsResumo = API_URL
        + "saude-mental/encaminhamentos/aps/especializada/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge;
      const urlEncaminhamentosAps = API_URL
        + "saude-mental/encaminhamentos/aps/especializada?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlEncaminhamentosAps, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosAps(result))
        .catch(error => console.log('error', error));

      fetch(urlEncaminhamentosApsResumo, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsResumo(result[0]))
        .catch(error => console.log('error', error));
    }
  }, [session?.user.municipio_id_ibge]);

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto="Dados referentes à produção da rede de atenção especializada, onde são registrados os procedimentos de psicólogas e psiquiatras de referência (ambulatório)"
        titulo="<strong>Cuidado compartilhado entre APS e ambulatório</strong>"
      />

      <GraficoInfo
        descricao="Quantidade de atendimentos de Saúde Mental realizados pela APS que resultaram em encaminhamento para cuidado ambulatorial"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        titulo="Atendimento"
      />

      {
        encaminhamentosApsResumo && session &&
        <>
          <Grid12Col
            items={ [
              <CardInfoTipoA
                key={ uuidv4() }
                descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
                indicador={ encaminhamentosApsResumo["atendimentos_sm_aps"] }
                titulo={ `Total de atendimentos pela APS em ${encaminhamentosApsResumo.nome_mes}` }
              />,
              <CardInfoTipoA
                key={ uuidv4() }
                descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
                indicador={ encaminhamentosApsResumo["encaminhamentos_especializada"] }
                titulo={ `Encaminhamentos para rede especializada em ${encaminhamentosApsResumo.nome_mes} (exceto CAPS)` }
              />,
              <CardInfoTipoA
                key={ uuidv4() }
                descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
                indicador={ encaminhamentosApsResumo["perc_encaminhamentos_especializada"] }
                indicadorSimbolo="%"
                titulo="Porcentagem"
              />,
            ] }
            proporcao="4-4-4"
          />
        </>
      }

      <GraficoInfo
        descricao="<strong>Atenção:</strong> o número de atendimentos no gráfico a seguir está em escala logarítmica, que reforça as variações mês a mês quando os números são pequenos, e diminui a variação aparente quando os números são muito grandes."
      />

      { encaminhamentosAps.length !== 0 &&
        <ReactEcharts
          option={ getEncaminhamentosChartOptions(encaminhamentosAps) }
          style={ { width: "100%", height: "70vh" } }
        />
      }
    </div>
  );
};

export default ApsAmbulatorio;
