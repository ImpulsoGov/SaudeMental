import { ButtonLight, PanelSelectorSM, TituloTexto } from "@impulsogov/design-system";
import { useRouter } from 'next/router';
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../helpers/RedirectHome";
import style from "../duvidas/Duvidas.module.css";
import Ambulatorio from "./ambulatorio";
import ConsultorioNaRua from "./consultorio-na-rua";
import ReducaoDeDanos from "./reducao-de-danos";
import Resumo from "./resumo";


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
        titulo="Outros serviços RAPS"
        texto=""
      />

      <PanelSelectorSM
        panel={ Number(panel) }
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
      />
    </div>
  );
}
