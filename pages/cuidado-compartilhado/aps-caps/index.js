import { TituloTexto, ButtonLight, GraficoInfo, TituloSmallTexto } from "@impulsogov/design-system";
import style from "../../duvidas/Duvidas.module.css";

const ApsCaps = ({ }) => {
  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Cuidado compartilhado entre APS e CAPS</strong>"
      />

      <GraficoInfo
        titulo="Matriciamentos"
        descricao="Quantidade de matriciamentos separados pelos CAPS que estão dentro e fora da meta (meta: 2 matriciamentos / mês em cada CAPS)"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        descricao="Quantidade de atendimentos de Saúde Mental realizados pela APS que resultarem em Encaminhamentos para CAPS."
      />
    </div>
  );
};

export default ApsCaps;
