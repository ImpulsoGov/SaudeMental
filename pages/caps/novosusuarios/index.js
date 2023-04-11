import { GraficoInfo, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getNovosUsuarios, getResumoNovosUsuarios } from "../../../requests/caps";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const NovoUsuario = () => {
  const { data: session } = useSession();
  const [novosUsuarios, setNovosUsusarios] = useState([]);
  const [resumoNovosUsuarios, setResumoNovosUsuarios] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setNovosUsusarios(await getNovosUsuarios(municipioIdSus));
      setResumoNovosUsuarios(
        await getResumoNovosUsuarios(municipioIdSus)
      );
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  return (
    <div>
      { console.log(novosUsuarios) }
      { console.log(resumoNovosUsuarios) }
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

export default NovoUsuario;
