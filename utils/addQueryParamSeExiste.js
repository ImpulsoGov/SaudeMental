export const addQueryParamSeExiste = (endpoint, paramNome, paramValor) => {
  if (paramValor !== undefined) {
    endpoint += `&${paramNome}=${paramValor}`;
  }
  return endpoint;
};