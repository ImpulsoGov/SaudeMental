import { ButtonLight } from "@impulsogov/design-system";
import { TituloTexto } from "@impulsogov/design-system";
import style from "./Duvidas.module.css"
import { redirectHomeNotLooged } from "../../helpers/RedirectHome";

export async function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx)
  if(redirect) return redirect
  return { props: {} }
}

const Index = () => {
  const args = {
    imagem: {
      posicao: null,
      url: ''
    },
    titulo: "Solicitação de suporte",
    texto: ""
  };
  return (
    <>
      <div className={style.BotaoVoltar}>
        <ButtonLight icone={{posicao: 'right',url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG'}} label="VOLTAR" link="/inicio"/>
      </div>
      <TituloTexto {...args} />
      <div className={style.Iframe} align="center" >
        <iframe
          width="85%"
          height="2000"
          src="https://docs.google.com/forms/d/e/1FAIpQLSelCjrYy908a4dpluwiTI6uev78eDesDWKiHUixOheKzg1nhQ/viewform"
          allowFullScreen
        />
      </div>
    </>
  )
}

export default Index;
