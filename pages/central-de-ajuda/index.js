import { ButtonLight, CardLargeGridToggleList, TituloTexto } from '@impulsogov/design-system';
import { redirectHomeNotLooged } from '../../helpers/RedirectHome';
import style from "../duvidas/Duvidas.module.css";

export async function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);
  if (redirect) return redirect;
  return { props: {} };
}

const Index = ({ res }) => {
  return (
    <>
      <div className={ style.BotaoVoltar }>
        <ButtonLight
          icone={ { posicao: 'right', url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG' } }
          label="VOLTAR"
          link="/inicio"
        />
      </div>
      <TituloTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        titulo="Central de ajuda"
        texto=""
      />
      <CardLargeGridToggleList
        cards={ [
          {
            icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU',
            link: '/',
            titulo: 'Sobre os indicadores'
          },
          {
            icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU',
            link: '/',
            titulo: 'Solicitar ajuda'
          },
          {
            icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU',
            infos: [
              {
                content: 'email@email.com',
                icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU'
              },
              {
                content: '(11) 91234-5678',
                icon: 'https://media.graphassets.com/X8qAQFkrTLapqBDlfkMO'
              }
            ],
            titulo: 'Contato'
          }
        ] }
        theme="ColorSM"
        togglelist={ {
          icon: 'https://media.graphassets.com/Eu5DAy5SnCFbpRetwKSl',
          list: [
            {
              title: 'Sobre a Impulso',
              blocks: [
                {
                  concept: {
                    elements: [],
                  },
                  subTitle: 'Qual é o objetivo da Impulso? Como o trabalho é financiado?',
                  description: "A Impulso é uma organização sem fins lucrativos, suprapartidária, e nossa missão é impulsionar o uso inteligente de dados e tecnologia no SUS para que todas as pessoas no Brasil tenham acesso a serviços de saúde de qualidade. Trabalhamos para que os profissionais do SUS tenham acesso às informações e ferramentas necessárias para agir de maneira preventiva e resolutiva e, para isso, nos unimos a eles para desenvolver soluções gratuitas que facilitam a identificação de riscos de saúde da população e a tomada de decisão com base em evidências.<br><br>Nosso trabalho é financiado por parceiros (como Institutos, Fundações e e empresas) que acreditam no nosso trabalho e fazem doações que viabilizam a nossa sustentabilidade financeira. Esse modelo permite que possamos oferecer produtos e serviços de forma gratuita para governos, focando nas necessidades da gestão pública e no impacto. <br><br>Para saber mais, acesse o nosso site ([https://www.impulsogov.org/](https://www.impulsogov.org/)) ou entre em contato conosco."
                },
              ]
            },
            {
              title: 'Dúvidas sobre o painel',
              blocks: [
                {
                  description: 'Como nossa intenção é conseguir levar o painel ao maior número de municípios possível, nesse momento não faremos nenhuma personalização. Os dados disponibilizados já são bastante completos, e já beneficiaram os outros municípios com os quais trabalhamos anteriormente. Caso tenham alguma sugestão de melhoria por favor nos envie, e avaliaremos a possibilidade de implementação',
                  subTitle: 'Para ter as informações do município no Painel é necessário que tenhamos prontuários e registros eletrônicos já implementados?'
                },
                {
                  description: 'Como nossa intenção é conseguir levar o painel ao maior número de municípios possível, nesse momento não faremos nenhuma personalização.',
                  subTitle: 'Os dados disponibilizados são apenas a partir do início da parceria ou existe dados históricos?'
                },
                {
                  description: 'Como nossa intenção é conseguir levar o painel ao maior número de municípios possível, nesse momento não faremos nenhuma personalização.',
                  subTitle: 'Os dados disponibilizados são apenas a partir do início da parceria ou existe dados históricos?'
                },
                {
                  description: 'Como nossa intenção é conseguir levar o painel ao maior número de municípios possível, nesse momento não faremos nenhuma personalização.',
                  subTitle: 'Como os dados são obtidos?'
                }
              ]
            },
            {
              title: 'Dúvidas administrativas',
              blocks: [
                {
                  description: 'Quanto tempo dura a ACT? ',
                  subTitle: 'O documento possui validade de um ano.'
                },
                {
                  description: 'Pré-selecionamos municípios que possuem, no mínimo, 3 CAPS + pelo menos um CAPS III ou IV.',
                  subTitle: 'Como os municípios participantes são escolhidos?'
                },
                {
                  description: 'Será necessário que um colaborador do município que já tenha acesso preencha o formulário de suporte disponível ao clicar na seção “Gerenciamento de usuários” da área logada e solicitar “Inclusão de usuário”.<br><br>Para solicitar a exclusão de um usuário o mesmo formulário deverá ser utilizado, nesse caso fazendo uma requisição para “Exclusão de usuário”.',
                  subTitle: 'Como solicito acesso a um novo usuário? Como consigo pedir a exclusão de um usuário?'
                },
              ]
            }
          ],
          theme: 'LightGrey',
          title: 'Perguntas frequentes'
        } }
      />
    </>
  );
};

export default Index;
