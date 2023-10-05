export const agregarPorAbusoSubstancias = (
  dados,
  propriedadeAbusoSubstancia,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeAbusoSubstancia]: abusoSubstancias
    } = dado;
    const abusoSubstanciasDados = dadosAgregados
      .find((item) => item.abusoSubstancias === abusoSubstancias);

    if (!abusoSubstanciasDados) {
      dadosAgregados.push({
        abusoSubstancias,
        quantidade
      });
    } else {
      abusoSubstanciasDados.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};

export const agregarPorSituacaoRua = (
  dados,
  propriedadeSituacaoRua,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeSituacaoRua]: situacaoRua,
    } = dado;
    const situacaoRuaDados = dadosAgregados
      .find((item) => item.situacaoRua === situacaoRua);

    if (!situacaoRuaDados) {
      dadosAgregados.push({
        situacaoRua,
        quantidade
      });
    } else {
      situacaoRuaDados.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};
