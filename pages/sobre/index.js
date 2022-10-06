import { TituloTexto } from "@impulsogov/design-system";
import Head from "next/head";

const args = {
  imagem: {
    posicao: null,
    url: ''
  },
  titulo: "A Impulso Gov",
  texto: "Impulso Gov, uma organização sem fins lucrativos e suprapartidária que apoia profissionais do SUS no aprimoramento das políticas públicas por meio do uso de dados e tecnologia, para que todas as pessoas no Brasil tenham acesso a serviços de saúde de qualidade.<br/><br/><b>Quer saber mais sobre a Impulso Gov Acesse o nosso <a style='text-decoration: none' href='impulsogov.org'>site.</a> </b> Impulso Gov, uma organização sem fins lucrativos e suprapartidária que apoia profissionais do SUS no aprimoramento das políticas públicas por meio do uso de dados e tecnologia, para que todas as pessoas no Brasil tenham acesso a serviços de saúde de qualidade.<br/><br/><b>Quer saber mais sobre a Impulso Gov Acesse o nosso <a style='text-decoration: none' href='impulsogov.org'>site.</a> </b> Impulso Gov, uma organização sem fins lucrativos e suprapartidária que apoia profissionais do SUS no aprimoramento das políticas públicas por meio do uso de dados e tecnologia, para que todas as pessoas no Brasil tenham acesso a serviços de saúde de qualidade.<br/><br/><b>Quer saber mais sobre a Impulso Gov Acesse o nosso <a style='text-decoration: none' href='impulsogov.org'>site.</a> </b> Impulso Gov, uma organização sem fins lucrativos e suprapartidária que apoia profissionais do SUS no aprimoramento das políticas públicas por meio do uso de dados e tecnologia, para que todas as pessoas no Brasil tenham acesso a serviços de saúde de qualidade.<br/><br/><b>Quer saber mais sobre a Impulso Gov Acesse o nosso <a style='text-decoration: none' href='impulsogov.org'>site.</a> </b>"
};

export default function Sobre() {
  return (
    <div>
      <TituloTexto {...args} />
    </div>
  )
}