const MENSAGEM_PADRAO_GRAFICO_SEM_DADOS = 'Não temos dados (ou eles são insuficientes) nas competências\n existentes na Plataforma para criação desse gráfico.';

export const gerarGraficoSemDados = (mensagem = MENSAGEM_PADRAO_GRAFICO_SEM_DADOS) => {
  return {
    graphic: {
      type: 'text',
      left: 'center',
      top: '38%',
      style: {
        fill: '#666',
        text: mensagem,
        font: 'bold 18px Arial, sans-serif',
        textAlign: 'center',
        textVerticalAlign: 'top'
      }
    },
  };
};