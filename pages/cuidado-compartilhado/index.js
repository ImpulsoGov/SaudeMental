import { ButtonLight, PanelSelectorSM, TituloTexto } from "@impulsogov/design-system";
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import style from "../duvidas/Duvidas.module.css";
import ApsAmbulatorio from "./aps-ambulatorio";
import ApsCaps from "./aps-caps";
import RapsHospitalar from "./raps-hospitalar";
import Resumo from "./resumo";

const Index = ({ }) => {
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
        titulo="Cuidado compartilhado de Saúde Mental entre as redes de saúde"
        texto=""
      />

      <PanelSelectorSM
        panel={ Number(panel) }
        components={ [[
          <Resumo key={ uuidv4() }></Resumo>,
          <ApsCaps key={ uuidv4() }></ApsCaps>,
          <ApsAmbulatorio key={ uuidv4() }></ApsAmbulatorio>,
          <RapsHospitalar key={ uuidv4() }></RapsHospitalar>
        ]] }
        subtitles={ [
          [
            {
              label: 'RESUMO'
            },
            {
              label: 'APS E CAPS'
            },
            {
              label: 'APS E AMBULATÓRIO'
            },
            {
              label: 'RAPS E ATENÇÃO HOSPITALAR'
            }
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
};

export default Index;
