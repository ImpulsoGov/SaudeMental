import React, { useCallback, useMemo, useState } from 'react';
import { FILTRO_ESTABELECIMENTO_MULTI_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../constants/FILTROS';
import { FiltroCompetencia, FiltroTexto } from '../Filtros';
import { TabelaProcedimentosPorCaps } from '../Tabelas';
import styles from './ProcedimentosPorCaps.module.css';

const ProcedimentosPorCaps = ({ procedimentos }) => {
  const [filtroEstabelecimentos, setFiltroEstabelecimentos] = useState(FILTRO_ESTABELECIMENTO_MULTI_DEFAULT);
  const [filtroPeriodos, setFiltroPeriodos] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroProcedimentos, setFiltroProcedimentos] = useState([]);

  const obterValoresDeFiltro = useCallback((filtro) => {
    return filtro.map(({ value }) => value);
  }, []);

  function agregarPorProcedimentoEEstabelecimento(procedimentos, propriedadeTipoProcedimento, propriedadeQuantidade, propriedadeEstabelecimento){
    const dadosAgregados = [];

    procedimentos.forEach((procedimento) => {
      const {[propriedadeQuantidade]: quantidade, [propriedadeTipoProcedimento]: tipoProcedimento, [propriedadeEstabelecimento]: estabelecimento} = procedimento;
      const procedimentoDados = dadosAgregados.find((item) => item.tipoProcedimento === tipoProcedimento);
      if(!procedimentoDados){
        dadosAgregados.push({
          tipoProcedimento,
          [estabelecimento]: quantidade
        });
      }else {
        procedimentoDados[estabelecimento]
          ? procedimentoDados[estabelecimento] += quantidade
          : procedimentoDados[estabelecimento] = quantidade;
      }
    });

    return dadosAgregados;
  };
  const procedimentosFiltradosOrdenados = useMemo(() => {
    const periodosSelecionados = obterValoresDeFiltro(filtroPeriodos);
    const estabelecimentosSelecionados = obterValoresDeFiltro(filtroEstabelecimentos);
    let procedimentosFiltrados = [];

    if (filtroProcedimentos.length === 0) {
      procedimentosFiltrados = procedimentos.filter((item) =>
        periodosSelecionados.includes(item.periodo)
        && estabelecimentosSelecionados.includes(item.estabelecimento)
        && item.estabelecimento_linha_perfil === 'Todos'
        && item.estabelecimento_linha_idade === 'Todos'
      );

      return procedimentosFiltrados.sort(ordenar);
    }

    const procedimentosSelecionados = obterValoresDeFiltro(filtroProcedimentos);

    procedimentosFiltrados = procedimentos.filter((item) =>
      estabelecimentosSelecionados.includes(item.estabelecimento)
      && periodosSelecionados.includes(item.periodo)
      && procedimentosSelecionados.includes(item.procedimento)
      && item.estabelecimento_linha_perfil === 'Todos'
      && item.estabelecimento_linha_idade === 'Todos'
    );

    return procedimentosFiltrados.sort(ordenar);
  }, [filtroEstabelecimentos, filtroPeriodos, filtroProcedimentos, obterValoresDeFiltro, procedimentos]);

  function ordenar(atualProcedimento, proximoProcedimento) {
    if (proximoProcedimento.procedimentos_registrados_total === atualProcedimento.procedimentos_registrados_total) {
      return atualProcedimento.estabelecimento.localeCompare(proximoProcedimento.estabelecimento);
    }

    return proximoProcedimento.procedimentos_registrados_total - atualProcedimento.procedimentos_registrados_total;
  };
  const agregadosPorProcedimentoEEestabelecimento = agregarPorProcedimentoEEstabelecimento(procedimentosFiltradosOrdenados, 'procedimento', 'procedimentos_registrados_total', 'estabelecimento');

  return (
    <>
      <div className={ styles.Filtros } >
        <FiltroTexto
          width='33%'
          dados={ procedimentos }
          label='Estabelecimento'
          propriedade='estabelecimento'
          valor={ filtroEstabelecimentos }
          setValor={ setFiltroEstabelecimentos }
          isMulti
        />

        <FiltroTexto
          width='33%'
          dados={ procedimentos }
          label='Nome do Procedimento'
          propriedade='procedimento'
          valor={ filtroProcedimentos }
          setValor={ setFiltroProcedimentos }
          isMulti
        />

        <FiltroCompetencia
          width='33%'
          dados={ procedimentos }
          valor={ filtroPeriodos }
          setValor={ setFiltroPeriodos }
          isMulti
        />
      </div>

      <div className={ styles.Tabela }>
        <TabelaProcedimentosPorCaps
          procedimentos={ agregadosPorProcedimentoEEestabelecimento }
        />
      </div>
    </>
  );
};

export default ProcedimentosPorCaps;
