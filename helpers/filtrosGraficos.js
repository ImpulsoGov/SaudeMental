import { components } from "react-select";

export const getPropsFiltroEstabelecimento = (dados, estadoFiltro, funcaoSetFiltro) => {
  const optionsSemDuplicadas = [];

  dados.forEach(({ estabelecimento }) => {
    const estabelecimentoEncontrado = optionsSemDuplicadas
      .find((item) => item.value === estabelecimento);

    if (!estabelecimentoEncontrado) {
      optionsSemDuplicadas.push({ value: estabelecimento, label: estabelecimento });
    }
  });

  const optionPersonalizada = ({ children, ...props }) => (
    <components.Control { ...props }>
      Estabelecimento: { children }
    </components.Control>
  );

  return {
    options: optionsSemDuplicadas.sort((a, b) => b.value.localeCompare(a.value)),
    defaultValue: estadoFiltro,
    selectedValue: estadoFiltro,
    onChange: (selected) => funcaoSetFiltro({
      value: selected.value,
      label: selected.value
    }),
    isMulti: false,
    isSearchable: false,
    components: { Control: optionPersonalizada },
    styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
  };
};

export const getPropsFiltroPeriodo = (dados, estadoFiltro, funcaoSetFiltro, multi = true) => {
  const periodosSemDuplicadas = [];

  dados.forEach(({ periodo, competencia }) => {
    const periodoEncontrado = periodosSemDuplicadas
      .find((item) => item.periodo === periodo);

    if (!periodoEncontrado) {
      periodosSemDuplicadas.push({ periodo, competencia });
    }
  });

  const periodosOrdenadosDesc = periodosSemDuplicadas
    .sort((a, b) => new Date(b.competencia) - new Date(a.competencia))
    .map(({ periodo }) => ({
      value: periodo,
      label: periodo
    }));

  const optionPersonalizada = ({ children, ...props }) => (
    <components.Control { ...props }>
      Competência: { children }
    </components.Control>
  );

  return {
    options: periodosOrdenadosDesc,
    defaultValue: estadoFiltro,
    selectedValue: estadoFiltro,
    onChange: (selected) => funcaoSetFiltro(selected),
    isMulti: multi,
    isSearchable: false,
    components: { Control: optionPersonalizada },
    styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
  };
};
