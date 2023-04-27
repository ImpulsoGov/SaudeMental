import { ButtonLight, TituloTexto } from "@impulsogov/design-system";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
// import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../helpers/RedirectHome";
import style from "../duvidas/Duvidas.module.css";
// import style from "../duvidas/Duvidas.module.css";
// import Ambulatorio from "./ambulatorio";
// import ConsultorioNaRua from "./consultorio-na-rua";
// import ReducaoDeDanos from "./reducao-de-danos";
// import Resumo from "./resumo";

export async function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);
  if (redirect) return redirect;
  return { props: {} };
}

export default function Paineis() {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(Number(router.query?.painel));
  const [activeTitleTabIndex, setActiveTitleTabIndex] = useState(0);
  useEffect(() => {
    setActiveTabIndex(Number(router.query?.painel));
  }, [router.query?.painel]);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { painel: activeTabIndex }
    },
      undefined, { shallow: true }
    );
  }, [activeTabIndex]);

  return (
    <div>
      <div className={ style.BotaoVoltar }>
        <ButtonLight
          icone={ { posicao: 'right', url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG' } }
          label="VOLTAR"
          link="/inicio" />
        <div style={ { position: "relative", left: "70%" } }>
          <ButtonLight
            icone={ { posicao: 'right', url: 'https://media.graphassets.com/yaYuyi0KS3WkqhKPUzro' } }
            label="CENTRAL DE AJUDA"
            link="/central-de-ajuda" />
        </div>
      </div>

      <TituloTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto="Olá! Nessa parte do painel você encontrará informações relativas ao Ambulatório de Saúde Mental, Consultório na Rua e ações de Redução de Danos do seu município. Lançaremos esses dados nas próximas semanas e, assim que eles estiverem disponíveis, avisaremos você por e-mail e whatsapp."
        titulo="<strong>EM BREVE</strong>"
      />

      {/* <TituloTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        titulo="Outros serviços RAPS"
        texto=""
      />

      <PanelSelectorSM
        panel={ Number(router.query?.painel) }
        states={ {
          activeTabIndex: Number(activeTabIndex),
          setActiveTabIndex: setActiveTabIndex,
          activeTitleTabIndex: activeTitleTabIndex,
          setActiveTitleTabIndex: setActiveTitleTabIndex
        } }
        components={ [[
          <Resumo key={ uuidv1() } />,
          <Ambulatorio key={ uuidv1() } />,
          <ConsultorioNaRua key={ uuidv1() } />,
          <ReducaoDeDanos key={ uuidv1() } />
        ]] }
        subtitles={ [
          [
            {
              label: "RESUMO",
            },
            {
              label: "AMBULATÓRIO DE SAÚDE MENTAL",
            },
            {
              label: "CONSULTÓRIO NA RUA",
            },
            {
              label: "REDUÇÃO DE DANOS",
            },
          ]
        ] }
        titles={ [
          {
            label: ''
          }
        ] }
      /> */}
    </div>
  );
}
