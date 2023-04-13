import { ButtonLight, PanelSelectorSM, TituloTexto } from "@impulsogov/design-system";
import { useRouter } from 'next/router';
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../helpers/RedirectHome";
import style from "../duvidas/Duvidas.module.css";
import AtendimentoIndividual from "./atendimentoindividuais";
import NovoUsuario from "./novosusuarios";
import PerfilUsuario from "./perfildousuario";
import ProcedimentosPorUsuarios from "./procedimentosporusuarios";
import Producao from "./producao";
import Resumo from "./resumo";
import TaxaAbandono from "./taxadeabandono";
import { useEffect, useState } from "react";


export async function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);
  if (redirect) return redirect;
  return { props: {} };
}

export default function Paineis() {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(Number(router.query?.painel));
  const [activeTitleTabIndex, setActiveTitleTabIndex] = useState(0)
  useEffect(()=>{
    setActiveTabIndex(Number(router.query?.painel))
  },[router.query?.painel])

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
        titulo="Acompanhamento dos serviços CAPS"
        texto=""
      />

      <PanelSelectorSM
        panel={ Number(router.query?.painel) }
        states = {{
          activeTabIndex : Number(activeTabIndex),
          setActiveTabIndex : setActiveTabIndex,
          activeTitleTabIndex : activeTitleTabIndex,
          setActiveTitleTabIndex : setActiveTitleTabIndex
        }}
        components={ [[
          <Resumo key={ uuidv1() } />,
          <PerfilUsuario key={ uuidv1() } />,
          <NovoUsuario key={ uuidv1() } />,
          <TaxaAbandono key={ uuidv1() } />,
          <AtendimentoIndividual key={ uuidv1() } />,
          <ProcedimentosPorUsuarios key={ uuidv1() } />,
          <Producao key={ uuidv1() } />,
        ]] }
        subtitles={ [
          [
            {
              label: "RESUMO",
            },
            {
              label: "PERFIL DO USUÁRIO",
            },
            {
              label: "NOVOS USUÁRIOS",
            },
            {
              label: "TAXA DE NÃO ADESÃO",
            },
            {
              label: "ATENDIMENTOS INDIVIDUAIS",
            },
            {
              label: "PROCEDIMENTOS POR USUÁRIO",
            },
            {
              label: "PRODUÇÃO",
            },
          ]
        ] }
        titles={ [
          {
            label: ''
          }
        ] }
      />
    </div>
  );
}
