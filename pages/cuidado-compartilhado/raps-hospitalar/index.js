import { TituloTexto, ButtonLight, GraficoInfo, TituloSmallTexto } from "@impulsogov/design-system";
import style from "../../duvidas/Duvidas.module.css";

const RapsHospitalar = ({ }) => {
  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Internações finalizadas desde o início do ano</strong>"
      />

      <GraficoInfo
        descricao="Internações finalizadas entre Julho de 2021 e Junho de 2022."
        fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS - Elaboração Impulso Gov"
        titulo="Usuários que foram atendidos na RAPS antes ou após a internação"
      />

      <GraficoInfo
        descricao="<strong>Atenção:</strong> os valores acima são aproximados, já que a conexão entre registros ambulatoriais e hospitalares do SUS a partir de dados abertos (não identificados) está sujeita a pequenas imprecisões."
      />

      <GraficoInfo
        descricao="Iniciadas entre Julho de 2021 e Junho de 2022."
        fonte="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS - Elaboração Impulso Gov"
        titulo="Novas internações e acolhimentos noturnos"
      />
    </div>
  );
};

export default RapsHospitalar;