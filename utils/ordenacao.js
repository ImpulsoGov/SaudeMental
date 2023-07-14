export const ordenarCrescentePorPropriedadeDeTexto = (dados, propriedade) => {
  return dados.sort((itemAtual, proximoItem) => itemAtual[propriedade].localeCompare(proximoItem[propriedade]));
};

export const ordenarDecrescentePorPropriedadeNumerica = (dados, propriedade) => {
  return dados.sort((itemAtual, proximoItem) => proximoItem[propriedade] - itemAtual[propriedade]);
};
