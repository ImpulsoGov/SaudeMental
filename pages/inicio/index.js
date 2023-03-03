import { CardLargeGrid, Greeting } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { LAYOUT } from "../../querys/LAYOUT";
import { getData } from "../../services/getData";

function Inicio({res}) {
  const { data: session,status } = useSession();

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
            links: res[0].menus[2].sub[0].item.map((item) => ({
              label: item.label,
              link: item.url
            })),
            titulo: res[0].menus[2].sub[0].label
          },
          {
            icon: 'https://media.graphassets.com/7wvfZaFDQXZ8VdssprbA',
            links: res[0].menus[2].sub[1].item.map((item) => ({
              label: item.label,
              link: item.url
            })),
            titulo: res[0].menus[2].sub[1].label
          },
          {
            icon: 'https://media.graphassets.com/nWpV6nQfCdgKqtkuOfg2',
            links: res[0].menus[2].sub[2].item.map((item) => ({
              label: item.label,
              link: item.url
            })),
            titulo: res[0].menus[2].sub[2].label
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

  const res = [await getData(LAYOUT)];

  return {
      props: {
        res
      }
  }
}

export default Inicio;
