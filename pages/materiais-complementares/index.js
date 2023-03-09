import { ButtonLight } from '@impulsogov/design-system'
import { TituloTexto } from "@impulsogov/design-system";
import style from "../duvidas/Duvidas.module.css"

const Index = ({res}) => {
return(
      <>
      <div className={style.BotaoVoltar}>
        <ButtonLight 
            icone={{posicao: 'right', url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG'}} 
            label="VOLTAR" 
            link="/inicio"/>
        <div style={{position:"relative",left:"70%"}}>
          <ButtonLight
              icone={{posicao: 'right', url: 'https://media.graphassets.com/yaYuyi0KS3WkqhKPUzro'}}
              label="CENTRAL DE AJUDA"
              link="/central-de-ajuda"/>
        </div>
      </div>
      <TituloTexto 
        imagem= {{
          posicao: null,
          url: ''
        }}
        titulo= "Materiais complementares"
        texto="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat adipiscing elit, sed dosiih ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
      />
      </>
  )
}

export default Index;
