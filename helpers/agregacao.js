export const agregarPorPropriedade = (dados, propriedade) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const { [propriedade]: prop } = dado;
    const dadoEncontrado = dadosAgregados
      .find((item) => item[propriedade] === prop);

    if (dadoEncontrado) {
      dadoEncontrado.dados.push({ ...dado });
    } else {
      dadosAgregados.push({
        [propriedade]: prop,
        dados: [{ ...dado }]
      });
    }
  });

  return dadosAgregados;
};

export const somarPropriedade = (dados, propriedade) => {
  return dados.reduce((acc, dado) => {
    const { [propriedade]: prop } = dado;

    return acc + prop;
  }, 0);
};
