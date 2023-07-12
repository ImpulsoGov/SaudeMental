export const ordenarCrescentePorPropriedadeDeTexto = (dados, propriedade) => {
  return dados.sort((itemAtual, proximoItem) => itemAtual[propriedade].localeCompare(proximoItem[propriedade]));
};
