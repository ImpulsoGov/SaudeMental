import { TituloTexto, GraficoInfo, ButtonLight, TituloSmallTexto, PanelSelectorSM } from "@impulsogov/design-system";
import style from "../duvidas/Duvidas.module.css";
import { useRouter } from 'next/router';
import ApsAmbulatorio from "./aps-ambulatorio";
import ApsCaps from "./aps-caps";
import RapsHospitalar from "./raps-hospitalar";

const Index = ({ }) => {
  const router = useRouter()
  const panel = router.query?.painel

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
          panel={Number(panel)}
          components={[[ApsAmbulatorio, ApsCaps, ApsAmbulatorio, RapsHospitalar]]}
          subtitles={[
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
          ]}
          titles={[
            {
              label: ''
            }
          ]}
        />

      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Resumo</strong>"
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e CAPS"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/aps-caps'}}
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e Cuidado Ambulatorial"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/aps-ambulatorio'}}
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre RAPS e Rede de Urgência e Emergência"
        descricao="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS.- Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/raps-hospitalar'}}
      />

    </div>
  );
};

export default Index;
