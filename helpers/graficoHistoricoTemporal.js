export const ordenarPorCompetencia = (
  dados,
  propriedade
) =>{
  const ordenadosPorCompetenciaAsc = dados
    .sort((a, b) => new Date(a.competencia) - new Date(b.competencia));
  const periodos = ordenadosPorCompetenciaAsc.map(({ periodo }) => periodo);
  const quantidades = ordenadosPorCompetenciaAsc
    .map((item) => item[propriedade]);
  return {
    ordenadosPorCompetenciaAsc,
    periodos,
    quantidades,
  };
};
