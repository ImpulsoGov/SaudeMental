import Head from "next/head";
import { ImagemFundo, HomeBanner, Parcerias } from "@impulsogov/design-system";
import { InfoTab } from "@impulsogov/design-system";

import { HOME } from "../querys/HOME";
import { getData } from "../services/getData";

export async function getStaticProps() {
  const res = [
    await getData(HOME)
  ];

  return {
    props: {
      res: res
    }
  }
}

export default function Home({res}) {
  return (
    <>
      <div style={{ backgroundColor: "#1B2D82" }}>
        <HomeBanner
          titulo={res[0].homeBanners[0].title}
          texto={res[0].homeBanners[0].text}
          theme="ColorSM"
        />

        <ImagemFundo
          imagem={res[0].assets[6].url}
          chamada={res[0].homeBanners[1].title}
          chamadacolor=""
          subtexto={res[0].homeBanners[1].text}
          cards={res[0].cards}
          botao={
            {
              label: "",
              url: ""
            }
          }
        />
        
        <section id="sobre">
          <InfoTab contentList={[
            {
              leftTitle: res[0].infoTabs[0].leftTitle,
              rightTitle: res[0].infoTabs[0].rigthTitle,
              rightContent: res[0].infoTabs[0].content,
              buttonTitle: res[0].infoTabs[0].buttonTitle,
              buttonLink: res[0].infoTabs[0].link
            },
            {
              leftTitle: res[0].infoTabs[1].leftTitle,
              rightTitle: res[0].infoTabs[1].rigthTitle,
              rightContent: res[0].infoTabs[1].content,
              buttonTitle: res[0].infoTabs[1].buttonTitle,
              buttonLink:res[0].infoTabs[1].link
            },
          ]} />
        </section>

        <Parcerias
          parceiros={[
            { alt: "parceiros", src: res[0].logos[4].logo.url, titulo: "Técnico e financeiro" },
            { alt: "parceiros", src:  "https://media.graphassets.com/L3pDd52rQSMTxBA0iZCE", titulo: "Financeiro" },
          ]}
          theme="ColorAGP"
          titulo="Apoio"
        />
        <Parcerias
          parceiros={[
            { alt: "parceiros", src:  res[0].logos[2].logo.url },
            { alt: "parceiros", src: "https://media.graphassets.com/aWUhrz97TpWYaM8FZkOO" },
            { alt: "parceiros", src: "https://media.graphassets.com/w0PeMRhSTMyiAJ6EoHCK" }
          ]}
          theme="ColorAGP"
          titulo="Governos Parceiros"
        />
      </div>

    </>
  )
}
