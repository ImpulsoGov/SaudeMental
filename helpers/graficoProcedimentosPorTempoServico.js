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

const ordenacaoProcedimentos = {
  'Até 6 meses': 1,
  '6 meses a 1 ano': 2,
  '1 a 2 anos': 3,
  '2 a 5 anos': 4,
  '5 anos ou mais': 5
};

export const ordenarPorTempoDeServico = (procedimentos) => {
  return procedimentos.sort((a, b) => {
    return ordenacaoProcedimentos[a.tempoServico] - ordenacaoProcedimentos[b.tempoServico];
  });
};