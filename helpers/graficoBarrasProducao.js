export const agregarPorPropriedadeESomarQuantidade = (
  dados,
  propriedadeAgregacao,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((item) => {
    const {
      periodo,
      [propriedadeAgregacao]: propriedade,
      [propriedadeQuantidade]: quantidade
    } = item;
    const propriedadeEncontrada = dadosAgregados
      .find((item) => item.propriedade === propriedade);

    if (!propriedadeEncontrada) {
      dadosAgregados.push({
        propriedade,
        quantidadesPorPeriodo: [{
          periodo,
          quantidade
        }]
      });
    } else {
      propriedadeEncontrada.quantidadesPorPeriodo.push({
        periodo,
        quantidade
      });
    }
  });

  return dadosAgregados;
};

export const getSomaQuantidadesPorPeriodo = (quantidadesPorPeriodo) => {
  return quantidadesPorPeriodo
    .reduce((acc, { quantidade }) =>
      acc + quantidade,
    0);
};