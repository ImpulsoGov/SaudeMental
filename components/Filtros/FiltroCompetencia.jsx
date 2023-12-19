import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { components } from 'react-select';
import Control from './Control';
import styles from './Filtros.module.css';
import Option from './Option';
import { SelectMultiplo, SelectUnico } from './index';

const FiltroCompetencia = ({
  dados,
  label,
  valor,
  setValor,
  isMulti,
  isSearchable,
  width,
  labelAllOption,
  showAllOption,
  isDefaultAllOption
}) => {
  const obterPeriodoFormatado = useCallback((competencia, nomeMes) => {
    const abreviacaoMes = nomeMes.slice(0, 3);
    const ano = new Date(competencia).getUTCFullYear();
    const abreviacaoAno = ano % 100;
    return `${abreviacaoMes}/${abreviacaoAno}`;
  }, []);
  const options = useMemo(() => {
    const competencias = [];
    dados.forEach(({ periodo, competencia, nome_mes: nomeMes }) => {
      const periodoEncontrado = competencias
        .find((item) => item.periodo === periodo);
      if (!periodoEncontrado) {
        competencias.push(
          periodo === 'Último período'
            ? {
              periodo,
              competencia,
              descricaoPeriodo: `(${obterPeriodoFormatado(competencia, nomeMes)})`
            }
            : {
              periodo,
              competencia,
              descricaoPeriodo: null
            }
        );
      }
    });
    return competencias
      .sort((a, b) => new Date(b.competencia) - new Date(a.competencia))
      .map(({ periodo, descricaoPeriodo }) => ({
        value: periodo,
        label: periodo,
        descricaoPeriodo
      }));
  }, [dados, obterPeriodoFormatado]);

  const getComponents = useCallback(() => ({
    Control: label ? Control : components.Control,
    Option: Option
  }), [label]);

  return (
    <div
      className={ styles.Filtro }
      style={{ width }}
    >
      {isMulti
        ? <SelectMultiplo
          valor={ valor }
          options={ options }
          setValor={ setValor }
          components={ getComponents() }
          controlLabel={ label }
          isSearchable={ isSearchable }
          showAllOption={ showAllOption }
          labelAllOption={ labelAllOption }
          isDefaultAllOption={ isDefaultAllOption }
        />
        : <SelectUnico
          valor={ valor }
          options={ options }
          setValor={ setValor }
          components={ getComponents() }
          controlLabel={ label }
          isSearchable={ isSearchable }
        />
      }
    </div>
  );
};

FiltroCompetencia.defaultProps = {
  isMulti: false,
  isSearchable: false,
  width: '50%',
  labelAllOption: 'Todas',
  showAllOption: false,
  isDefaultAllOption: false
};

FiltroCompetencia.propTypes = {
  dados: PropTypes.arrayOf(PropTypes.shape({
    periodo: PropTypes.string,
    competencia: PropTypes.string,
    periodo_ordem: PropTypes.number
  })).isRequired,
  valor: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  setValor: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  labelAllOption: PropTypes.string,
  showAllOption: PropTypes.bool,
  isDefaultAllOption: PropTypes.bool
};

export default FiltroCompetencia;
