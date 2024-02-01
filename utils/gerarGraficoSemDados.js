export const gerarGraficoSemDados = () => {
  return {
    graphic: {
      type: 'text',
      left: 'center',
      top: '38%',
      style: {
        fill: '#666',
        text: 'Não temos dados (ou eles são insuficientes) nas competências\n existentes na Plataforma para criação desse gráfico.',
        font: 'bold 18px Arial, sans-serif',
        textAlign: 'center',
        textVerticalAlign: 'top'
      }
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      show: false,
    },
  };
};