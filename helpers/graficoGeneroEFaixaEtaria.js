export const agregarPorFaixaEtariaEGenero = (
  dados,
  propriedadeFaixaEtaria,
  propriedadeSexo,
  propriedadeQuantidade
) => {
  const dadosAgregados = [];

  dados.forEach((dado) => {
    const {
      [propriedadeQuantidade]: quantidade,
      [propriedadeFaixaEtaria]: faixaEtaria,
      [propriedadeSexo]: usuarioSexo
    } = dado;
    const genero = usuarioSexo.toLowerCase();
    const faixaEtariaDados = dadosAgregados
      .find((item) => item.faixaEtaria === faixaEtaria);

    if (!faixaEtariaDados) {
      dadosAgregados.push({
        faixaEtaria,
        [genero]: quantidade
      });
    } else {
      faixaEtariaDados[genero]
        ? faixaEtariaDados[genero] += quantidade
        : faixaEtariaDados[genero] = quantidade;
    }
  });

  return dadosAgregados;
};

export const getOpcoesGraficoGeneroEFaixaEtaria = (dados, textoYAxis) => {
  const NOME_DIMENSAO = "genero";
  const LABELS_DIMENSAO = ["Masculino", "Feminino"];

  return {
    legend: {
      itemGap: 25,
    },
    tooltip: {},
    dataset: {
      dimensions: [NOME_DIMENSAO, ...LABELS_DIMENSAO],
      source: dados
        .sort((a, b) => a.faixaEtaria.localeCompare(b.faixaEtaria))
        .map((item) => ({
          [NOME_DIMENSAO]: item.faixaEtaria,
          [LABELS_DIMENSAO[0]]: item[LABELS_DIMENSAO[0].toLowerCase()],
          [LABELS_DIMENSAO[1]]: item[LABELS_DIMENSAO[1].toLowerCase()],
        })),
    },
    xAxis: {
      type: 'category',
      name: "Faixa etária (em anos)",
      nameLocation: "center",
      nameGap: 45,
    },
    yAxis: {
      name: textoYAxis,
      nameLocation: "center",
      nameGap: 55,
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          color: "#FA81E6"
        },
        label: {
          show: true,
          position: 'inside',
          formatter: `{@${LABELS_DIMENSAO[0]}}`,
          color: "#FFFFFF",
        },
      },
      {
        type: 'bar',
        itemStyle: {
          color: "#5367C9"
        },
        label: {
          show: true,
          position: 'inside',
          formatter: `{@${LABELS_DIMENSAO[1]}}`,
          color: "#FFFFFF",
        },
      }
    ]
  };
};
