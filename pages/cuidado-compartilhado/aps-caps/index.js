import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import ReactEcharts from "echarts-for-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';
import { TabelaMatriciamentosPorCaps } from "../../../components/Tabelas";
import { API_URL } from "../../../constants/API_URL";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getEncaminhamentosChartOptions } from "../../../helpers/getEncaminhamentosChartOptions";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ApsCaps = () => {
  const { data: session } = useSession();
  const [encaminhamentosApsCaps, setEncaminhamentosApsCaps] = useState([]);
  const [encaminhamentosApsCapsResumo, setEncaminhamentosApsCapsResumo] = useState(null);
  const [matriciamentosPorMunicipio, setMatriciamentosPorMunicipio] = useState(null);
  const [matriciamentosPorCaps, setMatriciamentosPorCaps] = useState([]);

  useEffect(() => {
    if (session?.user.municipio_id_ibge) {
      const getRequestOptions = { method: 'GET', redirect: 'follow' };

      const urlEncaminhamentosApsCaps = API_URL
        + "saude-mental/encaminhamentos/aps/caps?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlEncaminhamentosApsCaps, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsCaps(result))
        .catch(error => console.log('error', error));

      const urlEncaminhamentosApsCapsResumo = API_URL
        + "saude-mental/encaminhamentos/aps/caps/resumo?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlEncaminhamentosApsCapsResumo, getRequestOptions)
        .then(response => response.json())
        .then(result => setEncaminhamentosApsCapsResumo(result[0]))
        .catch(error => console.log('error', error));

      const urlMatriciamentosPorMunicipio = API_URL
        + "saude-mental/matriciamentos/municipio?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlMatriciamentosPorMunicipio, getRequestOptions)
        .then(response => response.json())
        .then(result => setMatriciamentosPorMunicipio(result[0]))
        .catch(error => console.log('error', error));

      const urlMatriciamentosPorCaps = API_URL
        + "saude-mental/matriciamentos/caps?municipio_id_sus="
        + session?.user.municipio_id_ibge;

      fetch(urlMatriciamentosPorCaps, getRequestOptions)
        .then(response => response.json())
        .then(result => setMatriciamentosPorCaps(result))
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
        titulo="<strong>Cuidado compartilhado entre APS e CAPS</strong>"
      />

      <GraficoInfo
        titulo="Matriciamentos"
        descricao="Quantidade de matriciamentos separados pelos CAPS que estão dentro e fora da meta (meta: 1 matriciamentos / mês em cada CAPS)"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      { matriciamentosPorMunicipio
        ? (
          <>
            <Grid12Col
              items={ [
                <CardInfoTipoA
                  key={ uuidv1() }
                  indicador={ matriciamentosPorMunicipio["estabelecimentos_fora_meta"] }
                  titulo="CAPS fora da meta"
                />,
                <CardInfoTipoA
                  key={ uuidv1() }
                  indicador={ matriciamentosPorMunicipio["estabelecimentos_na_meta"] }
                  titulo="CAPS dentro da meta"
                />,
                <CardInfoTipoA
                  key={ uuidv1() }
                  indicador={ matriciamentosPorMunicipio["quantidade_registrada"] }
                  titulo={ `Total de matriciamentos (até ${matriciamentosPorMunicipio["ate_mes"]})` }
                />,
              ] }
              proporcao="4-4-4"
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      { matriciamentosPorCaps.length !== 0
        ? <TabelaMatriciamentosPorCaps
          matriciamentos={ matriciamentosPorCaps }
        />
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        titulo="Atendimentos"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        descricao="Quantidade de atendimentos de Saúde Mental realizados pela APS que resultarem em Encaminhamentos para CAPS."
      />

      { encaminhamentosApsCapsResumo
        ? (
          <>
            <Grid12Col
              items={ [
                <CardInfoTipoA
                  key={ uuidv1() }
                  indicador={ encaminhamentosApsCapsResumo["atendimentos_sm_aps"] }
                  titulo={ `Total de atendimentos pela APS (em ${encaminhamentosApsCapsResumo.nome_mes})` }
                />,
                <CardInfoTipoA
                  key={ uuidv1() }
                  indicador={ encaminhamentosApsCapsResumo["encaminhamentos_caps"] }
                  titulo={ `Encaminhamentos para CAPS (em ${encaminhamentosApsCapsResumo.nome_mes})` }
                />,
                <CardInfoTipoA
                  key={ uuidv1() }
                  indicador={ encaminhamentosApsCapsResumo["perc_encaminhamentos_caps"] }
                  indicadorSimbolo="%"
                  titulo={ `Porcentagem (em ${encaminhamentosApsCapsResumo.nome_mes})` }
                />,
              ] }
              proporcao="4-4-4"
            />
          </>
        )
        : <Spinner theme="ColorSM" />
      }

      <GraficoInfo
        descricao="<strong>Atenção:</strong> o número de atendimentos no gráfico a seguir está em escala logarítmica, que reforça as variações mês a mês quando os números são pequenos, e diminui a variação aparente quando os números são muito grandes."
      />
      { encaminhamentosApsCaps.length !== 0
        ? <ReactEcharts
          option={ getEncaminhamentosChartOptions(encaminhamentosApsCaps) }
          style={ { width: "100%", height: "70vh" } }
        />
        : <Spinner theme="ColorSM" />
      }
    </div>
  );
};

export default ApsCaps;
