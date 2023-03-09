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
      </div>
      <TituloTexto 
        imagem= {{
          posicao: null,
          url: ''
        }}
        titulo= "Central de ajuda"
        texto=""
      />
      </>
  )
}

export default Index;
