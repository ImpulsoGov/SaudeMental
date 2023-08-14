import React, { useCallback, useMemo, useState } from 'react';
import { FiltroCompetencia, FiltroTexto } from '../Filtros';
import { FILTRO_ESTABELECIMENTO_MULTI_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../constants/FILTROS';
import { TabelaProcedimentosPorCaps } from '../Tabelas';
import styles from './ProcedimentosPorCaps.module.css';

const ProcedimentosPorCaps = ({ procedimentos }) => {
  const [filtroEstabelecimentos, setFiltroEstabelecimentos] = useState(FILTRO_ESTABELECIMENTO_MULTI_DEFAULT);
  const [filtroPeriodos, setFiltroPeriodos] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroProcedimentos, setFiltroProcedimentos] = useState([]);

  const obterValoresDeFiltro = useCallback((filtro) => {
    return filtro.map(({ value }) => value);
  }, []);

  const procedimentosFiltrados = useMemo(() => {
    const periodosSelecionados = obterValoresDeFiltro(filtroPeriodos);
    const estabelecimentosSelecionados = obterValoresDeFiltro(filtroEstabelecimentos);

    if (filtroProcedimentos.length === 0) {
      return procedimentos.filter((item) =>
        periodosSelecionados.includes(item.periodo)
        && estabelecimentosSelecionados.includes(item.estabelecimento)
        && item.estabelecimento_linha_perfil === 'Todos'
        && item.estabelecimento_linha_idade === 'Todos'
      );
    }

    const procedimentosSelecionados = obterValoresDeFiltro(filtroProcedimentos);

    return procedimentos.filter((item) =>
      estabelecimentosSelecionados.includes(item.estabelecimento)
      && periodosSelecionados.includes(item.periodo)
      && procedimentosSelecionados.includes(item.procedimento)
      && item.estabelecimento_linha_perfil === 'Todos'
      && item.estabelecimento_linha_idade === 'Todos'
    );
  }, [filtroEstabelecimentos, filtroPeriodos, filtroProcedimentos, obterValoresDeFiltro, procedimentos]);

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
          procedimentos={ procedimentosFiltrados }
        />
      </div>
    </>
  );
};

export default ProcedimentosPorCaps;
