import { ToggleList, ToggleText } from "@impulsogov/design-system";

export default function Glossario(){

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

  return(
    <>
      <ToggleText text="Entenda como interpretar os indicadores Impulso" />
      <ToggleList list={list} />
    </>
  )
}