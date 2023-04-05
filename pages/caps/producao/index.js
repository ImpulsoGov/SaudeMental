import { GraficoInfo, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { API_URL } from "../../../constants/API_URL";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Producao = () => {
  const { data: session } = useSession();
  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Referências de Saúde Mental</strong>"
      />

      <GraficoInfo
        titulo="Referência de Saúde Mental"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Total de atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos por horas trabalhadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />
    </div>
  );
};

export default Producao;
