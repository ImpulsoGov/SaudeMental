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

const ordenacaoGeneroEFaixaEtaria = {
  '0 a 4 anos': 1,
  '5 a 11 anos': 2,
  '12 a 17 anos': 3,
  '18 a 29 anos': 4,
  '30 a 39 anos': 5,
  '40 a 49 anos': 6,
  '50 a 59 anos': 7,
  '60 anos ou mais': 8
};

export const ordenarPorFaixaEtaria = (faixaEtariaDados) => {
  return faixaEtariaDados.sort((a, b) => {
    return ordenacaoGeneroEFaixaEtaria[a.faixaEtaria] - ordenacaoGeneroEFaixaEtaria[b.faixaEtaria];
  });
};