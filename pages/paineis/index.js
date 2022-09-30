import { PanelSelector } from "@impulsogov/design-system"

export default function Paineis() {
  const dsLink = [
    "https://datastudio.google.com/embed/reporting/12fb288f-4955-4930-b091-63da3f846c51/page/p_1i1fd8auvc?params=%7B%22df58%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580Santo%2520Andr%25C3%25A9%2520-%2520SP%22%7D",
    "https://datastudio.google.com/embed/reporting/12fb288f-4955-4930-b091-63da3f846c51/page/p_8qgdgiz2xc?params=%7B%22df56%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580Abadi%25C3%25A2nia%2520-%2520GO%22%7D",
    "https://datastudio.google.com/embed/reporting/12fb288f-4955-4930-b091-63da3f846c51/page/p_1i1fd8auvc?params=%7B%22df58%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580Santo%2520Andr%25C3%25A9%2520-%2520SP%22%7D",
    "https://datastudio.google.com/embed/reporting/12fb288f-4955-4930-b091-63da3f846c51/page/p_1i1fd8auvc?params=%7B%22df58%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580Santo%2520Andr%25C3%25A9%2520-%2520SP%22%7D",
    "https://datastudio.google.com/embed/reporting/12fb288f-4955-4930-b091-63da3f846c51/page/p_8qgdgiz2xc?params=%7B%22df56%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580Abadi%25C3%25A2nia%2520-%2520GO%22%7D",
    "https://datastudio.google.com/embed/reporting/12fb288f-4955-4930-b091-63da3f846c51/page/p_1i1fd8auvc?params=%7B%22df58%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580Santo%2520Andr%25C3%25A9%2520-%2520SP%22%7D",
    "https://datastudio.google.com/embed/reporting/12fb288f-4955-4930-b091-63da3f846c51/page/p_1i1fd8auvc?params=%7B%22df58%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580Santo%2520Andr%25C3%25A9%2520-%2520SP%22%7D",
  ]
  const labels = [
    {
      label: "RESUMO",
    },
    {
      label: "PERFIL DE USUÁRIOS",
    },
    {
      label: "NOVOS USUÁRIOS",
    },
    {
      label: "TAXA DE ABANDONO",
    },
    {
      label: "ATENDIMENTOS INDIVIDUAIS",
    },
    {
      label: "PROCEDIMENTOS POR USUÁRIO",
    },
    {
      label: "PRODUÇÃO",
    },
  ]

  return (
    <div style={{paddingTop: "140px", fontFamily: "Inter"}}>
      <PanelSelector
        links={dsLink}
        list={labels}
        title="Acompanhamento dos serviços CAPS"
      />
    </div>
  )
}