import { Spinner } from '@impulsogov/design-system';
import React, { useEffect, useMemo, useState } from 'react';
import { FILTRO_ESTABELECIMENTO_MULTI_DEFAULT, FILTRO_PERIODO_MULTI_DEFAULT } from '../../constants/FILTROS';
import { FiltroCompetencia, FiltroTexto } from '../Filtros';
import { TabelaProcedimentosPorCaps } from '../Tabelas';
import styles from './ProcedimentosPorCaps.module.css';

const ProcedimentosPorCaps = ({
  periodos,
  municipioIdSus,
  estabelecimentos,
  requisicao
}) => {
  const [procedimentos, setProcedimentos] = useState([]);
  const [filtroEstabelecimentos, setFiltroEstabelecimentos] = useState(FILTRO_ESTABELECIMENTO_MULTI_DEFAULT);
  const [filtroPeriodos, setFiltroPeriodos] = useState(FILTRO_PERIODO_MULTI_DEFAULT);
  const [filtroProcedimentos, setFiltroProcedimentos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (municipioIdSus) {
      setLoading(true);

      const promises = [];

      filtroEstabelecimentos.forEach(({ value: estabelecimento }) => {
        filtroPeriodos.forEach(({ value: periodo }) => {
          promises.push(requisicao({
            municipioIdSus: municipioIdSus,
            estabelecimentos: estabelecimento,
            periodos: periodo
          }));
        });
      });

      Promise.all(promises).then((respostas) => {
        const respostasUnificadas = [].concat(...respostas);
        setProcedimentos(respostasUnificadas);
      });

      setLoading(false);
    }
  }, [municipioIdSus, filtroEstabelecimentos, filtroPeriodos, requisicao]);

  function agregarPorProcedimentoEEstabelecimento(
    procedimentos,
    propriedadeTipoProcedimento,
    propriedadeQuantidade,
    propriedadeEstabelecimento
  ){
    const dadosAgregados = [];

    procedimentos.forEach((procedimento) => {
      const {
        id,
        [propriedadeQuantidade]: quantidade,
        [propriedadeTipoProcedimento]: tipoProcedimento,
        [propriedadeEstabelecimento]: estabelecimento,
      } = procedimento;

      const procedimentoDados = dadosAgregados.find((item) =>
        item.tipoProcedimento === tipoProcedimento
        && item.estabelecimento === estabelecimento
      );

      if(!procedimentoDados){
        dadosAgregados.push({
          id,
          tipoProcedimento,
          estabelecimento,
          quantidade,
        });
      }else {
        procedimentoDados.quantidade += quantidade;
      }
    });

    return dadosAgregados;
  };

  function ordenar(atualProcedimento, proximoProcedimento) {
    if (proximoProcedimento.quantidade === atualProcedimento.quantidade) {
      return atualProcedimento.estabelecimento.localeCompare(proximoProcedimento.estabelecimento);
    }

    return proximoProcedimento.quantidade - atualProcedimento.quantidade;
  };

  const procedimentosFiltradosPorNome = useMemo(() => {
    if (filtroProcedimentos.length === 0) {
      return procedimentos;
    }

    const procedimentosSelecionados = filtroProcedimentos.map(({ value }) => value);
    const procedimentosFiltrados = procedimentos.filter((item) =>
      procedimentosSelecionados.includes(item.procedimento)
    );

    return procedimentosFiltrados;
  }, [filtroProcedimentos, procedimentos]);

  const procedimentosAgregadosEOrdenados = useMemo(() => {
    const dadosAgregados = agregarPorProcedimentoEEstabelecimento(
      procedimentosFiltradosPorNome,
      'procedimento',
      'procedimentos_registrados_total',
      'estabelecimento'
    );

    return dadosAgregados.sort(ordenar);
  }, [procedimentosFiltradosPorNome]);

  return (
    <>
      <div className={ styles.Filtros } >
        <FiltroTexto
          width='33%'
          dados={ estabelecimentos }
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
          dados={ periodos }
          valor={ filtroPeriodos }
          setValor={ setFiltroPeriodos }
          label='Competência'
          isMulti
        />
      </div>

      { loading
        ? <Spinner theme='ColorSM' />
        : <div className={ styles.Tabela }>
          <TabelaProcedimentosPorCaps
            procedimentos={ procedimentosAgregadosEOrdenados }
          />
        </div>
      }
    </>
  );
};

export default ProcedimentosPorCaps;
