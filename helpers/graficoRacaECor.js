export const agregarPorRacaCor = (
  dados,
  propriedadeRacaCor,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeRacaCor]: racaCor
    } = dado;
    const racaCorDados = dadosAgregados
      .find((item) => item.racaCor === racaCor);

    if (!racaCorDados) {
      dadosAgregados.push({
        racaCor,
        quantidade
      });
    } else {
      racaCorDados.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};
