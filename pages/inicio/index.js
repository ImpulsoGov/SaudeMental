import { CardLargeGrid, Greeting, CardLargeGridInicioSM } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { redirectHomeNotLooged } from "../../helpers/RedirectHome";
import { HOME } from "../../querys/HOME";
import { getData } from "../../services/getData";

export async function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx)
  if(redirect) return redirect

  const res = [await getData(HOME)];

  return {
      props: {
        res
      }
  }
}


function Inicio({res}) {
  const { data: session } = useSession();

  return (
    <>
      <Greeting
        cargo={session?.user.cargo}
        greeting="Boas vindas"
        municipio_uf={session?.user.municipio}
        nome_usuario={session?.user.nome}
        texto="Aqui você pode acompanhar a situação das RAPS e demais serviços de saúde mental do seu minucípio, monitorando a qualidade do cuidado prestado e aprofundando seu diagnóstico sobre o território e a população atendida."
      />

      <CardLargeGrid
        cards={[
          {
            icon: 'https://media.graphassets.com/zCC2wPnJTxagLyEZFV45',
            links: res[0].cards[0].body.map((item) => ({
              label: item.label,
              link: item.url
            })),
            titulo: res[0].cards[0].title
          },
          {
            icon: 'https://media.graphassets.com/7wvfZaFDQXZ8VdssprbA',
            links: res[0].cards[1].body.map((item) => ({
              label: item.label,
              link: item.url
            })),
            titulo: res[0].cards[1].title
          },
          {
            icon: 'https://media.graphassets.com/nWpV6nQfCdgKqtkuOfg2',
            links: res[0].cards[2].body.map((item) => ({
              label: item.label,
              link: item.url
            })),
            titulo: res[0].cards[2].title
          }
        ]}
        obs=""
        theme="ColorSM"
      />
      <CardLargeGridInicioSM
        cards={[
          {
            icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU',
            link: '/materiais-complementares',
            texto: 'Encontrei aqui as respostas para as dúvidas enviadas ao longo da trilha de capacitação.',
            titulo: 'Materiais complementares'
          },
          {
            icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU',
            link: 'central-de-ajuda',
            texto: 'Encontre aqui as respostas para as dúvidas enviadas ao longo da trilha de capacitação.',
            titulo: 'Central de ajuda'
          }
        ]}
        cardsExtra={[
          {
            icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU',
            link: '/gestao-usuarios',
            titulo: 'Gerenciamento de usuários'
          },
          {
            icon: 'https://media.graphassets.com/6cOfkxeyT7245Fn19kgU',
            link: '/duvidas',
            titulo: 'Feedbacks e sugestões'
          }
        ]}
        obs="Para sair da área logada, basta ir no seu usuário no menu superior e clicar em ‘SAIR’."
        theme="ColorSM"
      />
    </>
  )
}


export default Inicio;
