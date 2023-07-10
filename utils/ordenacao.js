export const ordenarCrescentePorPropriedadeTexto = (dados, propriedade) => {
  return dados.sort((itemAtual, proximoItem) => itemAtual[propriedade].localeCompare(proximoItem[propriedade]));
};
