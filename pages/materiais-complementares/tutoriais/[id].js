import { ButtonLight, ConteudoVideo } from "@impulsogov/design-system";
import { useRouter } from 'next/router';
import React from 'react';
import style from "../../duvidas/Duvidas.module.css";

const Tutorial = () => {
  const router = useRouter();
  const tutorialId = router.query.id;

  return (
    <>
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

      <div style={ { marginLeft: "80px", marginTop: "40px", marginBottom: "80px" } }>
        <ConteudoVideo url={ `https://www.youtube.com/embed/${tutorialId}?cc_load_policy=1` } />
      </div>
    </>
  );
};

export default Tutorial;
