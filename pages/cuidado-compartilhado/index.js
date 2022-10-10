import { PanelSelector } from "@impulsogov/design-system"

export default function Paineis() {
  const dsLink = [
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
      label: "APS E CAPS",
    },
    {
      label: "APS E AMBULATÓRIO",
    },
    {
      label: "RAPS E ATENÇÃO HOSPITALAR",
    },
  ]

  return (
    <div style={{paddingTop: "40px", fontFamily: "Inter"}}>
      <PanelSelector
        links={dsLink}
        list={labels}
        title="Cuidado compartilhado de Saúde Mental entre as redes de saúde"
      />
    </div>
  )
}
