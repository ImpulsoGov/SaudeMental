import { ToggleList } from "@impulsogov/design-system";
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
      <ButtonLight icone={{posicao: 'right',url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG'}} label="VOLTAR" link="/inicio"/>
      </div>
      <ToggleText 
        title={res[0].homeBanners[3].title} 
        list={res[0].toggleTexts} 
        rightSubtitle={res[0].homeBanners[4].title} 
        leftSubtitle={res[0].homeBanners[5].title}
        imgLink={res[0].buttonImages[0].image.url}
      />
      <ToggleList list={res[0].toggleLists} />
    </>
  )
}