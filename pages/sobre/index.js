import { ParceriasDescritivo, TituloTexto } from "@impulsogov/design-system";
import styles from "./Sobre.module.css";

export default function Sobre() {
  const args = {
    imagem: {
      posicao: null,
      url: ''
    },
    titulo: "O que é o painel de indicadores de Saúde Mental da ImpulsoGov?",
    texto: `
      <br/>
      <p>A plataforma de Indicadores de Saúde Mental da ImpulsoGov é uma solução gratuita desenvolvida para apoiar a gestão dos serviços municipais de saúde mental. A partir de dados abertos, apresentamos um panorama sobre o cuidado oferecido pela Rede da Atenção Psicossocial (RAPS) e sobre a relação desta com as demais redes de saúde que atendem demandas de saúde mental no município.</p>

      <p>Para construir esta painel, desenvolvemos um conjunto de indicadores de acesso, produção, qualidade e perfil dos usuários atendidos na RAPS. Deste modo, proporcionamos uma ferramenta descomplicada para gestoras e gestores municipais realizarem diagnósticos do território e da população que atendem e monitorarem a qualidade dos serviços que estão sendo prestados.</p>

      <p>A partir da coleta de dados do SIASUS, do SISAB e de demais bases abertas do Ministério da Saúde, os indicadores do Painel de Saúde Mental da ImpulsoGov produzem informação visando responder às necessidades da gestão municipal para a tomada de decisões acertadas, com base em evidências, e o consequente aprimoramento contínuo da prestação de serviços públicos.</p>
    `
  };
  return (
    <div className={ styles.SobreContainer }>
      <TituloTexto { ...args } />

      <img
        src="https://media.graphassets.com/DeUMFdc2TjqPH3Ph4aIj"
        alt="Imagem com fontes de dados usadas na ImpulsoGov"
        width={ 450 }
        height={ 452 }
        className={ styles.ImagemSobre }
      />

      <div className={ styles.ParceriasContainer }>
        <ParceriasDescritivo
          parceiros={ [
            {
              alt: 'ImpulsoGov',
              descricao: 'Organização sem fins lucrativos e suprapartidária que apoia profissionais do SUS no aprimoramento das políticas públicas de saúde desenvolvendo soluções gratuitas por meio do uso inteligente de dados e tecnologia.',
              src: 'https://media.graphassets.com/GHfdxB6QqSAjDRAaEOtw',
              titulo: 'Realização'
            },
            {
              alt: 'Instituto Cactus',
              descricao: 'Organização filantrópica que atua de forma independente para ampliar o debate, os cuidados em prevenção de doenças e a promoção de saúde mental no Brasil, apoiando iniciativas que proporcionem melhora na qualidade de vida de todas as pessoas.',
              src: 'https://media.graphassets.com/ZMxaGH6zR86IjUgdLio5',
              titulo: 'Apoio técnico e financeiro'
            },
            {
              alt: 'Raia Drogasil',
              descricao: 'A RD – Gente, Saúde e Bem-Estar, presente em todos os estados do Brasil e formada pela fusão entre a Droga Raia e a Drogasil, tem o propósito de cuidar de perto da saúde e do bem-estar das pessoas em todos os momentos da vida.',
              src: 'https://media.graphassets.com/L3pDd52rQSMTxBA0iZCE',
              titulo: 'Apoio financeiro'
            }
          ] }
          theme="ColorSM"
          titulo="Este projeto foi idealizado pela ImpulsoGov, em parceria com o Instituto Cactus"
        />
      </div>
    </div>
  );
}
