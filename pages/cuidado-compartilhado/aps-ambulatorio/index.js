import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { API_URL } from "../../../constants/API_URL";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Index = () => {
  const { data: session } = useSession();
  const [dados, setDados] = useState();

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      const getRequestOptions = { method: 'GET', redirect: 'follow' };
      const urlEncaminhamentosAps = API_URL + "saude-mental/encaminhamentos/aps/especializada/resumo?municipio_id_sus=" + session?.user.municipio_id_ibge;

      fetch(urlEncaminhamentosAps, getRequestOptions)
        .then(response => response.json())
        .then(result => setDados(result))
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
        dados &&
        <>
          <Grid12Col
            items={ [
              <CardInfoTipoA
                key={ 1345 }
                descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
                indicador={ dados["atendimentos_sm_aps"] }
                titulo={ `Total de atendimentos pela APS em ${dados.nome_mes}` }
              />,
              <CardInfoTipoA
                key={ 1347 }
                descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
                indicador={ dados["encaminhamentos_especializada"] }
                titulo={ `Encaminhamentos para rede especializada em ${dados.nome_mes} (exceto CAPS)` }
              />,
              <CardInfoTipoA
                key={ 1346 }
                descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
                indicador={ dados["perc_encaminhamentos_especializada"] }
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
    </div>
  );
};

export default Index;
