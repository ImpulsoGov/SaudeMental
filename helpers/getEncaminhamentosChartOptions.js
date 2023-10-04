export const agruparPorConduta = (encaminhamentos) => {
  const encaminhamentosAgrupados = [];

  encaminhamentos.forEach((encaminhamento) => {
    const { conduta, competencia, periodo, quantidade_registrada: quantidadeRegistrada } = encaminhamento;
    const encaminhamentoEncontrado = encaminhamentosAgrupados.find((item) => item.conduta === conduta);

    if (!encaminhamentoEncontrado) {
      encaminhamentosAgrupados.push({
        conduta,
        quantidadesPorPeriodo: [{ competencia, periodo, quantidadeRegistrada }]
      });
    } else {
      encaminhamentoEncontrado.quantidadesPorPeriodo.push({ competencia, periodo, quantidadeRegistrada });
    }
  });

  return encaminhamentosAgrupados;
};

export const ordenarPorCompetencia = (encaminhamentos) => {
  return encaminhamentos.map(({ conduta, quantidadesPorPeriodo }) => ({
    conduta,
    quantidadesPorPeriodo: quantidadesPorPeriodo
      .sort((a, b) => new Date(a.competencia) - new Date(b.competencia))
  }));
};
