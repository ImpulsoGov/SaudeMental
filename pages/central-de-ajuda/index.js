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
              blocks: [
                {
                  concept: {
                    elements: [],
                  },
                  description: 'Como nossa intenção é conseguir levar o painel ao maior número de municípios possível, nesse momento não faremos nenhuma personalização. Os dados disponibilizados já são bastante completos, e já beneficiaram os outros municípios com os quais trabalhamos anteriormente. Caso tenham alguma sugestão de melhoria por favor nos envie, e avaliaremos a possibilidade de implementação',
                  subTitle: 'Consigo personalizar o painel para o meu município?'
                },
                {
                  concept: {
                    elements: [],
                  },
                  description: 'Como nossa intenção é conseguir levar o painel ao maior número de municípios possível, nesse momento não faremos nenhuma personalização. Os dados disponibilizados já são bastante completos, e já beneficiaram os outros municípios com os quais trabalhamos anteriormente. Caso tenham alguma sugestão de melhoria por favor nos envie, e avaliaremos a possibilidade de implementação',
                  subTitle: 'Qual é o objetivo da Impulso? Como o trabalho é financiado?'
                },
              ],
              title: 'Interesses da Impulso e financiadores'
            },
            {
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
              ],
              title: 'Dúvidas sobre a obtenção de dados'
            },
            {
              blocks: [
                {
                  description: 'O documento possui validade de um ano.',
                  subTitle: 'Quanto tempo dura a ACT?'
                },
                {
                  description: 'Pré-selecionamos municípios que possuem, no mínimo, 3 CAPS + pelo menos um CAPS III ou IV.',
                  subTitle: 'Como os municípios participantes são escolhidos?'
                },
              ],
              title: 'Dúvidas administrativas'
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
