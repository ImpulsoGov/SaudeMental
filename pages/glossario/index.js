import { TituloTexto, ToggleList } from "@impulsogov/design-system";
import { ToggleText } from "@impulsogov/design-system";
import { ButtonLight } from "@impulsogov/design-system";
import { GLOSSARIO } from "../../querys/GLOSSARIO";
import { getData } from "../../services/getData";
import style from "../duvidas/Duvidas.module.css"

export async function getStaticProps() {
  const res = [
    await getData(GLOSSARIO)
  ];

  return {
    props: {
      res: res
    }
  }
}

export default function Glossario({res}) {
  return (
    <>
      <div className={style.BotaoVoltar}>
      <ButtonLight icone={{posicao: 'right',url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG'}} label="VOLTAR" link="/central-de-ajuda"/>
      </div>
      <TituloTexto
        imagem = {{
          posicao: null,
          url: ''
        }}
        titulo = "Entenda como interpretar os indicadores Impulso"
        texto = ""
        />
      <ToggleList
          title="Indicadores"
          list={res[0].toggleLists} 
        />
    </>
  )
}