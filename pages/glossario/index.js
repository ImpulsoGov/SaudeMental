import { ToggleList } from "@impulsogov/design-system";
import { ToggleText } from "../../components/ToggleText";

export default function Glossario() {

  const listSigla = [
    {
      initials: "AIH",
      label: "Autorização de Internação Hospitalar"
    },
    {
      initials: "AIH",
      label: "Autorização de Internação Hospitalar"
    },
    {
      initials: "AIH",
      label: "Autorização de Internação Hospitalar"
    },
    {
      initials: "AIH",
      label: "Autorização de Internação Hospitalar"
    },
    {
      initials: "AIH",
      label: "Autorização de Internação Hospitalar"
    },
    {
      initials: "AIH",
      label: "Autorização de Internação Hospitalar"
    },
  ]

  const list = [
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
    {
      title: "Serviços do CAPS",
      subTitle: "Número de usuários ativos",
      description: "Definição: que tiveram pelo menos um registro em ficha de ações psicossociais no mês de referência ou em um dos dois meses anteriores.",
      source: "Fonte: RAAS/SIASUS"
    },
  ]

  return (
    <>
      <ToggleText 
        title="Entenda como interpretar os indicadores Impulso" 
        list={listSigla} 
        rightSubtitle="Siglas" 
        leftSubtitle="Glossário" 
        imgLink={"https://media.graphassets.com/WRihknmuQGKEPw9xmMOy"}
      />
      <ToggleList list={list} />
    </>
  )
}