export const removerDadosZeradosPorPropriedade = (dados, propriedade) => {
  return dados.filter((item) => item[propriedade] !== 0);
};
