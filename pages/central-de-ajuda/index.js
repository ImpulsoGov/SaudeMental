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
            link: '/glossario',
            titulo: 'Sobre os indicadores'
          },
          {
            icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU',
            link: '/duvidas',
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
              title: 'Primeiro acesso e gerenciamento de usuários',
              blocks: [
                {
                  subTitle: 'Esqueci qual é o meu e-mail cadastrado',
                  description: 'Caso não se lembre do e-mail que nos forneceu para a criação do seu login e senha, entre em contato conosco pelo Whatsapp <u><a href="https://wa.me/message/IX6SKT7NHH7OE1" target="_blank">(11) 94264-2429</a></u> nos dizendo seu nome e o seu município que nós te reenviaremos o seu e-mail cadastrado.',
                },
                {
                  subTitle: 'Esqueci minha senha',
                  description: 'Caso não se lembre da senha cadastrada, você pode cadastrar uma nova senha diretamente da tela de login. Na parte superior do <u><a href="https://saudemental.impulsogov.org/" target="_blank">site</a></u> clique em “Entrar” e depois em “Esqueci minha senha”, seguindo posteriormente os passos que aparecerão na tela.',
                },
                {
                  subTitle: 'Estou fazendo meu primeiro acesso como município parceiro e ainda não tenho uma senha',
                  description: 'Para realizar o seu primeiro acesso à área restrita, vá na parte superior do <u><a href="https://saudemental.impulsogov.org/" target="_blank">site</a></u> e clique em “Entrar“. Insira o e-mail que nos forneceu para a criação do seu cadastro e na tela seguinte clique em “Primeiro Acesso“. Nós te enviaremos um código de validação para o seu e-mail cadastrado. Digite o código de validação que você receberá. Em seguida, crie sua senha e realize o login na área restrita.',
                },
                {
                  subTitle: 'Como solicito acesso a um novo usuário?',
                  description: 'Será necessário que um colaborador do município que já tenha acesso preencha o formulário de suporte disponível ao clicar na seção “Gerenciamento de usuários” da área logada e solicitar “Inclusão de usuário”.<br><br>Caso o pedido venha diretamente de uma das pessoas autorizadas a solicitar novos acessos já vamos aprovar automaticamente. Caso venha de algum usuário não autorizado, vamos entrar em contato com as pessoas previamente autorizadas a liberar o acesso para efetuar a validação.',
                },
                {
                  subTitle: 'Como solicito a exclusão de um usuário?',
                  description: 'Para solicitar a exclusão de um usuário o mesmo formulário deverá ser utilizado, nesse caso fazendo uma requisição para “Exclusão de usuário”.<br><br>Caso o pedido venha diretamente de uma das pessoas autorizadas a solicitar novos acessos já vamos aprovar automaticamente. Caso venha de algum usuário não autorizado, vamos entrar em contato com as pessoas previamente autorizadas a liberar o acesso para efetuar a validação.'
                },
              ]
            },
            {
              title: 'Sobre a Impulso',
              blocks: [
                {
                  concept: {
                    elements: [],
                  },
                  subTitle: 'O que é a ImpulsoGov? Como o trabalho é financiado?',
                  description: 'A ImpulsoGov é uma organização sem fins lucrativos, suprapartidária, e nossa missão é impulsionar o uso inteligente de dados e tecnologia no SUS para que todas as pessoas no Brasil tenham acesso a serviços de saúde de qualidade. Trabalhamos para que os profissionais do SUS tenham acesso às informações e ferramentas necessárias para agir de maneira preventiva e resolutiva e, para isso, nos unimos a eles para desenvolver soluções gratuitas que facilitam a identificação de riscos de saúde da população e a tomada de decisão com base em evidências.<br><br>Nosso trabalho é financiado por organizações filantrópicas e empresas que acreditam em nosso trabalho e fazem doações que viabilizam a nossa sustentabilidade financeira. Esse modelo permite que possamos oferecer produtos e serviços de forma gratuita para governos, focando nas necessidades da gestão pública e no impacto.<br><br>Para saber mais, acesse o nosso <u><a href="https://saudemental.impulsogov.org/" target="_blank">site</a></u> ou entre em contato conosco através do email <u><a href="mailto:saudemental@impulsogov.org" target="_blank">saudemental@impulsogov.org</a></u>.'
                },
              ]
            },
            {
              title: 'Dúvidas sobre o painel',
              blocks: [
                {
                  subTitle: 'Consigo personalizar o painel para o meu município?',
                  description: 'Nossa intenção é expandir o acesso ao painel e assim apoiar o maior número de municípios possível. Por isso, neste momento, não faremos personalizações na ferramenta.<br><br>Mas sabemos que, com o uso do painel, podem surgir ideias e necessidades de melhorias e adoraríamos receber suas sugestões. Vamos avaliar cada pedido com atenção e cuidado e avisaremos se a implementação for viável.',
                },
                {
                  subTitle: 'Quais são os pré-requisitos técnicos que precisamos cumprir para que os dados do meu municípios sejam disponibilizados no painel?',
                  description: 'Não é necessário ter nenhum tipo de prontuário ou digitalização de registro do dia-a-dia das unidades para usar o nosso painel. Os dados de CAPS são obtidos a partir das fichas RAAS e BPA que são mensalmente enviados diretamente para o Ministério da Saúde pelas unidades de saúde, secretarias de saúde ou prefeituras (o fluxo pode variar dependendo do seu município). Portanto, contanto que alguém esteja inserindo mensalmente os dados de RAAS e BPA no sistema do Ministério da Saúde, no fluxo que já é padrão para os municípios, sejam os prontuários físicos ou digitais, a ImpulsoGov terá acesso a todos os dados necessários para que você possa ver as informações sobre o seu município no painel de indicadores.<br></br>É importante destacar que, para garantir um melhor funcionando do painel de indicadores para o seu município, os registros devem ser preferencialmente feitos em fichas RAAS, com exceção do acolhimento inicial que parte das fichas de BPA individualizado (BPA-i), sendo poucos os procedimentos que deveriam ser prioritariamente registrados em BPA consolidado (BPA-c).<br></br>Chamamos atenção a esse ponto porque em casos de registros feitos em BPA-c, ao invés de RAAS ou BPA-i, os dados do seu município podem parecer subnotificados, uma vez que o registro consolidado impede o acesso à individualização dos atendimentos que a RAAS e o BPA-i permitem, não sendo possível, por exemplo, contabilizar se determinado paciente está tendo uma oferta adequada de cuidado multiprofissional, ou se não aderiu ao serviço após primeiro acolhimento.',
                },
                {
                  subTitle: 'O painel disponibiliza somente os dados gerados a partir do início da parceria ou mostra dados anteriores?',
                  description: 'O painel pode mostrar dados históricos a partir de 2017. Caso o seu município queira consultar séries históricas anteriores, orientamos que entre em contato com a nossa equipe para avaliação.',
                },
                {
                  subTitle: 'Como os dados são obtidos?',
                  description: 'Os dados são obtidos mensalmente a partir dos repositórios públicos do DataSUS. Esses repositórios contêm dados enviados pelos municípios após a remoção das informações pessoais que identificam os usuários e chegam para a ImpulsoGov criptografados. Buscamos estes dados nos repositórios de forma automatizada mensalmente e aplicamos uma série de tratamentos para calcular os indicadores exibidos no painel. <br><br>A parceria com a ImpulsoGov não exige nenhuma mudança na prática de registro e envio de dados para o Ministério da Saúde que o seu município já adota. Basta seguir fazendo os registros e envios mensais para que os dados sejam disponibilizados para a ImpulsoGov. É importante ressaltar que o Ministério da Saúde leva dois meses para disponibilizar os dados nos repositórios abertos. ',
                },
                {
                  subTitle: 'Quando os dados são atualizados?',
                  description: 'Os dados do painel são atualizados nas primeiras semanas de todo mês, a partir da disponibilização das informações do Ministério da Saúde nos repositórios públicos do DataSUS. Essa disponibilização do ministério ocorre com um atraso de dois meses em relação a competência atual. Por exemplo, se o mês vigente é março, mostraremos dados de janeiro no painel.',
                },
                {
                  subTitle: 'Algo na tela não está carregando! O que fazer?',
                  description: 'Indicamos uma lista de passos que você deve realizar, nesta ordem, caso algo não esteja carregando na tela:<ol><li>Verifique se sua conexão com a internet está ativa e estável;</li><li>Atualize a página pelo botão de recarregar página no seu navegador, ou utilizando a tecla F5 do teclado;</li><li>Limpe os dados de navegação do site de Saúde Mental e realize o login novamente. Escolha seu navegador abaixo e siga o passo a passo dele para limpar os dados de navegação:<ul><u><li><a href="https://support.google.com/accounts/answer/32050?hl=pt-BR&co=GENIE.Platform%3DDesktop" target="_blank">Chrome</a></li></u><u><li><a href="https://support.mozilla.org/pt-BR/kb/gerencie-configuracoes-de-armazenamento-local-de-s" target="_blank">Firefox</a></li></u><u><li><a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank">Edge</a></li></u></ul><li>Caso os passos anteriores não solucionem o problema de carregamento, entre em contato com a equipe pelo formulário de suporte.</li></li></ol>',
                },
                {
                  subTitle: 'Algum dado parece incorreto ou alguma informação dos CAPS está desatualizada! Como proceder?',
                  description: '<b>Para valores que parecem incorretos</b><br><br>Considerando que os dados utilizados nos indicadores são extraídos diretamente dos repositórios do Ministério da Saúde, caso algum indicador pareça incorreto, primeiro é necessário verificar se a incongruência é relacionada à subnotificação de fichas. Isso pode ocorrer principalmente em três momentos:<ul><li> Forma de registro</li><li> Os registros estão sendo realizados corretamente, de forma completa, nos estabelecimentos de saúde?</li><li> Envio dos registros</li><li> Esses registros estão sendo enviados mensalmente para o Ministério da Saúde?</li><li> Correção de inconsistências</li><li> Caso o Ministério da Saúde identifique algum problema em algum registro, existe uma pessoa responsável por analisar o relatório de inconsistências e reenviar os dados?</li></ul>Após checagem dos pontos acima, caso a resposta seja *Sim* para as três perguntas, entre em contato com a nossa equipe pelo formulário de suporte relatando detalhadamente qual o indicador que parece estar incorreto e em quanto difere da realidade [caso saiba valores de parâmetro].<br><br><b>Para classificação de linha de cuidado de CAPS incorreta ou CAPS não aparecendo</b><br><br>Para a listagem dos CAPS ativos e classificação de linha de cuidado nossa equipe considerou as respostas enviadas por um gestor do município no formulário <em>Informações para personalização do painel</em>, preenchido no início da parceria com a ImpulsoGov. Caso algum CAPS apareça com a linha de cuidado incorreta (por exemplo, é Álcool e Drogas e está classificado como Geral), entre em contato com a nossa equipe pelo formulário de suporte indicando qual o nome do estabelecimento, como ele está sendo exibido no painel e como deveria ser mostrado.<br>Caso algum CAPS não esteja aparecendo como um estabelecimento no painel de indicadores, entre em contato com a nossa equipe pelo formulário de suporte indicando as informações abaixo:<br><blockquote>CNES <em>[insira aqui o CNES]</em>, nome oficial: <em>[insira aqui nome oficial]</em>, apelido: <em>[insira aqui o apelido se houver]</em>, Linha de cuidado: <em>[indique se Geral ou AD]</em>, Faixa etária de cuidado: <em>[indique se adulto ou inf/juv]</em></blockquote>'
                },
              ]
            },
            {
              title: 'Dúvidas administrativas',
              blocks: [
                {
                  subTitle: 'Quanto tempo dura a ACT? ',
                  description: 'O documento possui validade de um ano.'
                },
                {
                  subTitle: 'Como os municípios participantes são escolhidos?',
                  description: 'Pré-selecionamos municípios que possuem, no mínimo, 3 CAPS + pelo menos um CAPS III ou IV.'
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