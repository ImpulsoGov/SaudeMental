import { ToggleList } from "@impulsogov/design-system";
import { ToggleText } from "../../components/ToggleText";
import { GLOSSARIO } from "../../querys/GLOSSARIO";
import { getData } from "../../services/getData";

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
  console.log('gloss', res[0].buttonImages[0].image.url)

  const list = [
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
  ]

  return (
    <>
      <ToggleText 
        title={res[0].homeBanners[3].title} 
        list={res[0].toggleTexts} 
        rightSubtitle={res[0].homeBanners[4].title} 
        leftSubtitle={res[0].homeBanners[5].title}
        imgLink={res[0].buttonImages[0].image.url}
      />
      <ToggleList list={list} />
    </>
  )
}