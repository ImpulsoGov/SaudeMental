import { TituloTexto, ButtonLight, GraficoInfo, TituloSmallTexto, Grid12Col, CardInfoTipoA } from "@impulsogov/design-system";
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
      <>
          <Grid12Col
            items={ [
              <CardInfoTipoA
                key={ 1345 }
                indicador={ 0 }
                titulo="CAPS fora da meta"
              />,
              <CardInfoTipoA
                key={ 1347 }
                indicador={ 0 }
                titulo="CAPS dentro da meta"
              />,
              <CardInfoTipoA
                key={ 1346 }
                indicador={ 0 }
                titulo="Total de matriciamentos (até Agosto)"
              />,
            ] }
            proporcao="4-4-4"
          />
        </>

      <GraficoInfo
        titulo="Atendimentos"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        descricao="Quantidade de atendimentos de Saúde Mental realizados pela APS que resultarem em Encaminhamentos para CAPS."
      />
        <>
          <Grid12Col
            items={ [
              <CardInfoTipoA
                key={ 1345 }
                indicador={ 0 }
                titulo="Total de atendimentos pela APS"
              />,
              <CardInfoTipoA
                key={ 1347 }
                indicador={ 0 }
                titulo="Encaminhamentos para CAPS"
              />,
              <CardInfoTipoA
                key={ 1346 }
                indicador={ 0 }
                indicadorSimbolo="%"
                titulo="Porcentagem"
              />,
            ] }
            proporcao="4-4-4"
          />
        </>

      <GraficoInfo
        descricao="<strong>Atenção:</strong> o número de atendimentos no gráfico a seguir está em escala logarítmica, que reforça as variações mês a mês quando os números são pequenos, e diminui a variação aparente quando os números são muito grandes."
      />
    </div>
  );
};

export default ApsCaps;
