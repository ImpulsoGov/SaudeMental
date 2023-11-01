export const agregarPorFaixaEtariaEGenero = (
  dados,
  propriedadeFaixaEtaria,
  propriedadeSexo,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeFaixaEtaria]: faixaEtaria,
      [propriedadeSexo]: usuarioSexo
    } = dado;
    const genero = usuarioSexo.toLowerCase();
    const faixaEtariaDados = dadosAgregados
      .find((item) => item.faixaEtaria === faixaEtaria);

    if (!faixaEtariaDados) {
      dadosAgregados.push({
        faixaEtaria,
        [genero]: quantidade
      });
    } else {
      faixaEtariaDados[genero]
        ? faixaEtariaDados[genero] += quantidade
        : faixaEtariaDados[genero] = quantidade;
    }
  });

  return dadosAgregados;
};
