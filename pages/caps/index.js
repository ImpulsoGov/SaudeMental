import { ButtonLight, PanelSelectorSM, TituloTexto } from "@impulsogov/design-system";
import { useRouter } from 'next/router';
import { redirectHomeNotLooged } from "../../helpers/RedirectHome";
import { v1 as uuidv1 } from 'uuid';
import style from "../duvidas/Duvidas.module.css";
import Resumo from "./resumo";
import TaxaAbandono from "./taxadeabandono";
import Producao from "./producao";
import ProcedimentosPorUsuarios from "./procedimentosporusuarios";
import PerfilUsuario from "./perfildousuario";
import NovoUsuario from "./novosusuarios";
import AtendimentoIndividual from "./atendimentoindividuais";


export async function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);
  if (redirect) return redirect;
  return { props: {} };
}

export default function Paineis() {
  const router = useRouter();
  const panel = router.query?.painel;

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
        panel={ Number(panel) }
        components={ [[
          <Resumo key={ uuidv1() } />,
          <TaxaAbandono key={ uuidv1() } />,
          <Producao key={ uuidv1() } />,
          <ProcedimentosPorUsuarios key={ uuidv1() } />,
          <PerfilUsuario key={ uuidv1() } />,
          <NovoUsuario key={ uuidv1() } />,
          <AtendimentoIndividual key={ uuidv1() } />,
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
              label: "NOVOS USUÁRIO",
            },
            {
              label: "TAXA DE ABANDONO",
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
