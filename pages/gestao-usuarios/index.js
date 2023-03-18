import { ButtonLight, TituloTexto } from "@impulsogov/design-system";
import { redirectHomeNotLooged } from "../../helpers/RedirectHome";
import style from "../duvidas/Duvidas.module.css";

export async function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if(redirect) return redirect;

  return { props: {} };
}

const Index = () => {
  const args = {
    imagem: {
      posicao: null,
      url: ""
    },
    titulo: "Gerenciamento de usuários",
    texto: ""
  };

  return (
    <>
      <div className={style.BotaoVoltar}>
        <ButtonLight
          icone={{posicao: "right",url: "https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG"}}
          label="VOLTAR"
          link="/inicio"
        />
      </div>

      <TituloTexto {...args} />

      <div className={style.Iframe} align="center">
        <iframe
          width="85%"
          height="2000"
          src="https://docs.google.com/forms/d/e/1FAIpQLSfaZYOSLz3ka3JgR8uXi20oE5sBKZqvBgAaoMAzlukyXeNXKw/viewform"
          allowFullScreen
        />
      </div>
    </>
  )
}

export default Index;
