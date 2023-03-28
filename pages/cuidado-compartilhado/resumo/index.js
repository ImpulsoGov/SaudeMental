import { TituloTexto, ButtonLight, GraficoInfo, TituloSmallTexto } from "@impulsogov/design-system";
import style from "../../duvidas/Duvidas.module.css";

const Resumo = ({ }) => {
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
        titulo="Cuidado compartilhado entre APS e CAPS"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/aps-caps'}}
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e Cuidado Ambulatorial"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/aps-ambulatorio'}}
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre RAPS e Rede de Urgência e Emergência"
        descricao="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS.- Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/raps-hospitalar'}}
      />
    </div>
  );
};

export default Resumo;
