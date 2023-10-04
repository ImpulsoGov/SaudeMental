export const agruparPorTempoDeServico = (procedimentos) => {
  const procedimentosAgregados = [];

  procedimentos.forEach((procedimento) => {
    const {
      tempo_servico_descricao: tempoServico,
      procedimentos_por_usuario: procedimentosPorUsuario
    } = procedimento;
    const procedimentoEncontrado = procedimentosAgregados
      .find((item) => item.tempoServico === tempoServico);

    if (!procedimentoEncontrado) {
      procedimentosAgregados.push({
        tempoServico,
        procedimentosPorPeriodo: [{
          procedimentosPorUsuario
        }]
      });
    } else {
      procedimentoEncontrado.procedimentosPorPeriodo.push({
        procedimentosPorUsuario
      });
    }
  });

  return procedimentosAgregados;
};

export const getMediaProcedimentosPorPeriodo = (procedimentosPorPeriodo) => {
  const somaProcedimentos = procedimentosPorPeriodo
    .reduce((acc, { procedimentosPorUsuario }) => acc + procedimentosPorUsuario, 0);

  return somaProcedimentos / (procedimentosPorPeriodo.length);
};
