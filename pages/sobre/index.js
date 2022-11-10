import { TituloTexto } from "@impulsogov/design-system";
import { getData } from "../../services/getData";



export default function Sobre({res}) {
  const args = {
    imagem: {
      posicao: null,
      url: ''
    },
    titulo: "O que é a plataforma de indicadores Impulso Saúde Mental?",
    texto: "<p>A plataforma de indicadores de Impulso Saúde Mental é uma solução gratuita, voltada a apoiar a gestão dos serviços de saúde mental municipal. A partir de dados abertos, apresentamos um panorama sobre o cuidado oferecido pela Rede da Atenção Psicossocial (RAPS) e sobre a relação desta com as demais redes de saúde que atendem demandas de saúde mental no município.</p><p>Para a realização da plataforma, desenvolvemos um conjunto de indicadores de acesso, produção, qualidade e perfil dos usuários atendidos na RAPS. Deste modo, proporcionamos uma ferramenta descomplicada para gestoras e gestores municipais realizarem diagnósticos do território e da população que atendem e monitorarem a qualidade dos serviços que estão sendo prestados.</p><p>A partir da coleta de dados do SIASUS, do SISAB e de demais bases abertas do Ministério da Saúde, os indicadores Impulso produzem informação visando responder às necessidades do gestor municipal para a tomada de decisões acertadas e consequente aprimoramento contínuo da prestação de serviços públicos.</p><img src=\"https://media.graphassets.com/resize=width:900,height:620/JrYhvT35S2HTzKIlvSTh\" alt=\"about-illustration-2.jpg\" title=\"about-illustration-2.jpg\" width=\"1096\" height=\"900\" /><h2><strong>Esse projeto foi realizado em uma parceria entre a ImpulsoGov e o Instituto Cactus.</strong></h2><p></p><img src=\"https://media.graphassets.com/10kMBjyYQMa697EBwA7l\" alt=\"sobre-logo-impulso-gov-2.png\" title=\"sobre-logo-impulso-gov-2.png\" width=\"195\" height=\"34\" /><p>Sobre a ImpulsoGov: Organização sem fins lucrativos que trabalha lado a lado com estados e municípios para aprimorar a coleta e análise de dados dos serviços de saúde e, desta forma, impactar positivamente na vida da população.</p><img src=\"https://media.graphassets.com/uxyaHJfWRgKFM8rWxC61\" alt=\"sobre-logo-cactus-instituto-2.png\" title=\"sobre-logo-cactus-instituto-2.png\" width=\"196\" height=\"71\" /><p><br>Sobre o Instituto Cactus: Organização filantrópica, independente e suprapartidária que promove iniciativas para ampliar a informação e os cuidados com a saúde mental.</p>"
  };
  return (
    <div>
      <TituloTexto {...args} />
    </div>
  )
}
