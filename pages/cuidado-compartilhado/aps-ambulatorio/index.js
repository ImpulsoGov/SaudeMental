import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";

const Index = ({ }) => {
  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto="Dados referentes à produção da rede de atenção especializada, onde são registrados os procedimentos de psicólogas e psiquiatras de referência (ambulatório)"
        titulo="<strong>Cuidado compartilhado entre APS e ambulatório</strong>"
      />

      <GraficoInfo
        descricao="Quantidade de atendimentos de Saúde Mental realizados pela APS que resultaram em encaminhamento para cuidado ambulatorial"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        titulo="Atendimento"
      />

      <Grid12Col
        items={ [
          <CardInfoTipoA
            key={ 1345 }
            descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
            indicador={ 692 }
            titulo="Total de atendimentos pela APS em Junho"
          />,
          <CardInfoTipoA
            key={ 1347 }
            descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
            indicador={ 692 }
            titulo="Encaminhamentos para rede especializada em Junho (exceto CAPS)"
          />,
          <CardInfoTipoA
            key={ 1346 }
            descricao="Não foram atendidos na RAPS nos 6 meses anteriores à internação nem até o mês após a alta"
            indicador={ 692 }
            titulo="Porcentagem"
          />,
        ] }
        proporcao="4-4-4"
      />

      <GraficoInfo
        descricao="<strong>Atenção:</strong> o número de atendimentos no gráfico a seguir está em escala logarítmica, que reforça as variações mês a mês quando os números são pequenos, e diminui a variação aparente quando os números são muito grandes."
      />
    </div>
  );
};

export default Index;
