import { PanelSelector } from "@impulsogov/design-system";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../contexts/Context";
import { useRouter } from 'next/router';
import { BackButton } from "../../components/BackButton";

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

  return { props: {} }
}

export default function Paineis() {
  const [city] = useContext(Context);
  const [panelLinks, setPanelLink] = useState([]);

  useEffect(()=> {
    if(city === "Aracaju - SE"){
      setPanelLink([
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_3p8joonopc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_8kr3t7popc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_pidyab2upc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_e0msek2upc",
      ])
    }
    if(city === "Recife - PE"){
      setPanelLink([
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_3p8joonopc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_8kr3t7popc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_pidyab2upc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_e0msek2upc",
      ])
    }

    if(city === "Aparecida de Goiânia - GO"){
      setPanelLink([
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_3p8joonopc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_8kr3t7popc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_pidyab2upc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_e0msek2upc",
      ])
    }
  }, [city]);
  const labels = [
    {
      label: "RESUMO",
    },
    {
      label: "APS E CAPS",
    },
    {
      label: "APS E AMBULATÓRIO",
    },
    {
      label: "RAPS E ATENÇÃO HOSPITALAR",
    },
  ]
  const router = useRouter()
  const panel = router.query?.painel
  return (
    <div>
      <BackButton />

      <PanelSelector
        panel={Number(panel)}
        links={[panelLinks]}
        list={[labels]}
        titles={[{label:"Cuidado compartilhado de Saúde Mental entre as redes de saúde"}]}
      />
    </div>
  )
}
