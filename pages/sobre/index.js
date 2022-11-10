import { TituloTexto } from "@impulsogov/design-system";
import { ABOUT } from "../../querys/ABOUT";
import { getData } from "../../services/getData";

export async function getStaticProps() {
  const res = [
    await getData(ABOUT)
  ];

  return {
    props: {
      res: res
    }
  }
}


export default function Sobre({res}) {
  const args = {
    imagem: {
      posicao: null,
      url: ''
    },
    titulo: res[0].homeBanners[2].title,
    texto: res[0].homeBanners[2].text.html
  };
  return (
    <div>
      <TituloTexto {...args} />
    </div>
  )
}
