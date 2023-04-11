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

const Resumo = () => {
  const { data: session } = useSession();
  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Resumo</strong>"
      />

      <GraficoInfo
        titulo="Taxa de abandono"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
        descricao="Conjunto de usuários com 1º procedimento em Março/2022 e abandono até Agosto/2022"
        tooltip="Porcentagem dos usuários que entraram nos serviços CAPS e deixaram de frequentar o serviço  nos 6 meses posteriores."
        link={ { label: 'Mais informações', url: '/caps?painel=1' } }
      />

      <GraficoInfo
        titulo="Usuários que realizaram apenas atendimentos individuais"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
        descricao="Dados de Setembro"
        tooltip="Porcentagem do total de usuários que frequentaram serviços CAPS no mês que realizou apenas atendimentos individuais."
        link={ { label: 'Mais informações', url: '/caps?painel=4' } }
      />

      <GraficoInfo
        titulo="Procedimento por usuário"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
        descricao="Dados de Setembro"
        tooltip="Média de procedimentos realizados por usuários que frequentaram CAPS no mês de referência."
        link={ { label: 'Mais informações', url: '/caps?painel=5' } }
      />

      <GraficoInfo
        titulo="Produção"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        descricao="Dados de Setembro"
        link={ { label: 'Mais informações', url: '/caps?painel=6' } }
      />
    </div>
  );
};

export default Resumo;
