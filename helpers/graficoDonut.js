import {
  QUANTIDADE_CORES_GRAFICO_DONUT
} from '../constants/GRAFICO_DONUT';

export const agregarQuantidadePorPropriedadeNome = (dados, propriedadeNome, propriedadeQuantidade) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeNome]: nome
    } = dado;

    const dadoEncontrado = dadosAgregados
      .find((item) => item.nome === nome);

    if (!dadoEncontrado) {
      dadosAgregados.push({
        nome,
        quantidade
      });
    } else {
      dadoEncontrado.quantidade += quantidade;
    }
  });

  return dadosAgregados;
};

export const agruparItensQueUltrapassamPaleta = (dados) => {
  const dadosAgrupados = [];
  const fatiaDeAgrupamento = {
    nome: 'Outros',
    quantidade: 0
  };

  dados.forEach((dado, index) => {
    if (index >= QUANTIDADE_CORES_GRAFICO_DONUT - 1) {
      fatiaDeAgrupamento.quantidade += dado.quantidade;
    } else {
      dadosAgrupados.push(dado);
    }
  });

  dadosAgrupados.push(fatiaDeAgrupamento);

  return dadosAgrupados;
};