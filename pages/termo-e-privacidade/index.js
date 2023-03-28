import { ToggleList, TituloTexto } from "@impulsogov/design-system";
import style from "../duvidas/Duvidas.module.css"

export async function getStaticProps() {
  const res = [
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
      <TituloTexto
        imagem = {{
          posicao: null,
          url: ''
        }}
        titulo = "Termos de Uso e Politica de Privacidade"
        texto = "Bem-vindo à página de Saúde Mental da ImpulsoGov. Ao acessar ou usar este site, você concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso."
        />
        <ToggleList
          title="Termos de Uso"
          list={[
            {
              title: 'Disposições gerais',
              blocks: [
                {
                  subTitle: '',
                  description: 'Estes termos de uso serão regidos e interpretados de acordo com as leis brasileiras, sem consideração aos princípios de conflito de leis. Qualquer litígio decorrente destes termos de uso será resolvido exclusivamente nos tribunais brasileiros. Estes termos de uso constituem o acordo completo entre o proprietário do site e o usuário em relação ao uso do site.',
                  source: '',
                },
              ],
            },
            {
              title: 'Os produtos do Impulso Previne são gratuitos?',
              blocks: [
                {
                  subTitle: '',
                  description: 'Sim, todos os produtos do Impulso Previne são gratuitos. Na nossa área pública você encontra dados quadrimestralmente atualizados sobre os resultados dos indicadores de desempenho de todos os municípios no Previne Brasil, além dos dados de Capitação Ponderada e Incentivos a Ações Estratégicas. Atualizamos essa área do nosso site através dos dados públicos do SISAB (Sistema de Informação em Saúde para a Atenção Primária). Basta clicar no menu superior DADOS PÚBLICOS - Q3/22 e selecionar seu município. Na nossa área logada (acesso restrito), oferecemos produtos de monitoramento nominal para os municípios parceiros.',
                  source: '',
                },
              ],
            },
          ]}
        />
        <ToggleList
          title="Política de Privacidade"
          list={[
            {
              title: 'Disposições gerais',
              blocks: [
                {
                  subTitle: '',
                  description: 'A ImpulsoGov valoriza a privacidade dos seus usuários e está comprometida em proteger quaisquer informações pessoais que possam ser coletadas durante o uso do nosso site. Esta política de privacidade descreve como coletamos, usamos, compartilhamos e protegemos informações pessoais dos usuários.',
                  source: '',
                },
              ],
            },
            {
              title: 'Coleta de informações pessoais',
              blocks: [
                {
                  subTitle: '',
                  description: 'A ImpulsoGov pode coletar informações pessoais, como nome, endereço de e-mail e informações de contato, quando um usuário se registra ou preenche um formulário em nosso site. Nós não coletamos informações pessoais sensíveis, como informações de saúde, raça, orientação sexual, religião ou filiação política.',
                  source: '',
                },
              ],
            },
            {
              title: 'Uso de informações pessoais',
              blocks: [
                {
                  subTitle: '',
                  description: 'A ImpulsoGov usa as informações pessoais coletadas apenas para os fins para os quais foram fornecidas. Por exemplo, para responder a perguntas do usuário, fornecer suporte ao usuário, enviar boletins informativos ou outras comunicações promocionais. Nós não compartilhamos informações pessoais com terceiros, exceto conforme descrito nesta política de privacidade.',
                  source: '',
                },
              ],
            },
            {
              title: 'Compartilhamento de informações pessoais',
              blocks: [
                {
                  subTitle: '',
                  description: 'A ImpulsoGov não compartilha informações pessoais com terceiros, exceto em casos limitados, como quando exigido por lei.',
                  source: '',
                },
              ],
            },
            {
              title: 'Proteção de informações pessoais',
              blocks: [
                {
                  subTitle: '',
                  description: 'A ImpulsoGov adota medidas padrão de acordo com a Lei Geral de Proteção de Dados (LGPD) para proteger quaisquer informações pessoais coletadas em nosso site. Isso inclui a implementação de medidas técnicas e organizacionais apropriadas para proteger contra acesso não autorizado, divulgação, alteração ou destruição das informações pessoais.<br></br>A Impulso Gov tem um Encarregado de Proteção de Dados (EPD) que presta informação, quando tal lhe for solicitado, sobre as suas obrigações e questões relativas ao tratamento e à proteção de dados pessoais, em conformidade com as normas aplicáveis, constituindo um ponto de contato entre o titular dos dados e a Impulso Gov bem como com a autoridade de controle (Agência Nacional de Proteção de Dados – ANPD), que pode ser contactada através do e-mail contato@impulsogov.org.',
                  source: '',
                },
              ],
            },
            {
              title: 'Cookies e tecnologias similares',
              blocks: [
                {
                  subTitle: '',
                  description:'A ImpulsoGov pode usar cookies e outras tecnologias similares para melhorar a experiência do usuário em nosso site. Os cookies são pequenos arquivos que são armazenados no seu computador quando você visita um site. Nós usamos cookies para rastrear informações sobre a sua visita ao nosso site e para personalizar a sua experiência. Você pode optar por desativar os cookies nas configurações do seu navegador.',
                  source: '',
                },
              ],
            },
            {
              title: 'Links para sites de terceiros',
              blocks: [
                {
                  subTitle: '',
                  description: 'A ImpulsoGov pode fornecer links para sites de terceiros que não são de propriedade ou controlados por nós. Esta política de privacidade se aplica apenas ao nosso site, e não somos responsáveis pelo conteúdo, políticas de privacidade ou práticas de qualquer site que não seja de nossa propriedade ou controle.',
                  source: '',
                },
              ],
            },
            {
              title: 'Alterações nesta política de privacidade',
              blocks: [
                {
                  subTitle: '',
                  description: 'A ImpulsoGov pode atualizar esta política de privacidade de tempos em tempos. Se fizermos alterações significativas na forma como tratamos as informações pessoais, notificaremos os usuários por meio de um aviso em nosso site ou por e-mail.',
                  source: '',
                },
              ],
            },
            {
              title: 'Direitos do titular dos dados pessoais',
              blocks: [
                {
                  subTitle: '',
                  description: 'Por regra, o(a) titular dos dados tem os seguintes direitos em termos de proteção de dados pessoais: direito de acesso, direito de retificação, direito de apagamento, direito de limitação do tratamento, direito de portabilidade, direito de oposição e direito de não ficar sujeito a decisões automatizadas. A retirada do consentimento não compromete a licitude do tratamento efetuado com base no consentimento previamente dado.',
                  source: '',
                },
              ],
            },
            {
              title: 'Procedimento para o exercício dos direitos',
              blocks: [
                {
                  subTitle: '',
                  description: 'Para exercer os seus direitos, o titular dos dados deverá contatar a Impulso Gov através do e-mail contato@impulsogov.org. O exercício dos direitos é gratuito, exceto se tratando de um pedido manifestamente infundado ou excessivo ou injustificadamente reiterado, caso em que poderá ser cobrada uma taxa razoável tendo em conta os custos de envio. A resposta aos pedidos deverá ser prestada, sem demora injustificada, no prazo de quinze dias a contar da recepção do pedido, salvo se for um pedido especialmente complexo ou ocorrer em circunstâncias excepcionais. Esse prazo pode ser prorrogado por até dois meses, quando for necessário, tendo em conta a complexidade do pedido e o número de pedidos recebidos. No âmbito do seu pedido, poderá ser-lhe solicitado que faça prova da sua identidade de modo a assegurar que o compartilhamento dos dados pessoais é feito com o respectivo titular. Caso assim o entenda, poderá, ainda, apresentar reclamação junto da Agência Nacional de Proteção de Dados (ANPD).',
                  source: '',
                },
              ],
            },
            {
              title: 'Contato',
              blocks: [
                {
                  subTitle: '',
                  description: 'Se você tiver alguma dúvida sobre esta política de privacidade ou sobre como a ImpulsoGov trata informações pessoais, entre em contato conosco através do e-mail contato@impulsogov.org.',
                  source: '',
                },
              ],
            },
            {
              title: 'Contato',
              blocks: [
                {
                  subTitle: '',
                  description: '',
                  source: '',
                },
              ],
            },
          ]}
        />
    </>
  )
}