import { CardLargeGrid, Greeting } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { HOME } from "../../querys/HOME";
import { getData } from "../../services/getData";

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
        obs="Para sair da área logada, basta ir no seu usuário no menu superior e clicar em ‘SAIR’."
        theme="ColorSM"
      />
    </>
  )
}

export async function getServerSideProps({req}) {
  let redirect;
  const userIsActive = req.cookies['next-auth.session-token'];
  const userIsActiveSecure = req.cookies['__Secure-next-auth.session-token'];

  if(userIsActive){
    redirect=true
  }else{
    redirect = userIsActiveSecure ? true : false;
  }

  if(!redirect) {
    return {
      redirect: {
        destination: "/",
        permanent: false, // make this true if you want the redirect to be cached by the search engines and clients forever
      }, 
    }
  }

  const res = [await getData(HOME)];

  return {
      props: {
        res
      }
  }
}

export default Inicio;
