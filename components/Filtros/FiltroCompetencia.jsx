import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import Select, { components } from 'react-select';
import Control from './Control';
import styles from './Filtros.module.css';
import Option from './Option';

// Referência:
// https://codesandbox.io/s/distracted-panini-8458i?file=/src/MultiSelect.js:567-589
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
  const valueRef = useRef(valor);
  valueRef.current = valor;

  const selectAllOption = {
    value: '<SELECT_ALL>',
    label: labelAllOption
  };

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

  useEffect(() => {
    if (isDefaultAllOption && showAllOption && isMulti) {
      setValor(options);
    }
  }, [isDefaultAllOption, options, setValor, showAllOption, isMulti]);

  const isSelectAllSelected = () =>
    valueRef.current.length === options.length;

  const isOptionSelected = option =>
    valueRef.current.some(({ value }) => value === option.value) ||
    isSelectAllSelected();

  const getOptions = () => showAllOption ? [selectAllOption, ...options] : options;

  const getValue = () =>
    isSelectAllSelected() ? [selectAllOption] : valor;

  const handleChangeWithAllOption = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta;

    if (action === 'select-option' && option.value === selectAllOption.value) {
      setValor(options, actionMeta);
    } else if (
      (action === 'deselect-option' &&
        option.value === selectAllOption.value) ||
      (action === 'remove-value' &&
        removedValue.value === selectAllOption.value)
    ) {
      setValor([], actionMeta);
    } else if (
      actionMeta.action === 'deselect-option' &&
      isSelectAllSelected()
    ) {
      setValor(
        options.filter(({ value }) => value !== option.value),
        actionMeta
      );
    } else {
      setValor(newValue || [], actionMeta);
    }
  };

  const handleChange = (selected) => setValor(selected);

  return (
    <div
      className={ styles.Filtro }
      style={{ width }}
    >
      <Select
        isOptionSelected={isOptionSelected}
        options={ getOptions() }
        value={getValue()}
        defaultValue={ valor }
        selectedValue={ valor }
        onChange={ showAllOption ? handleChangeWithAllOption : handleChange }
        isMulti={ isMulti }
        isSearchable={ isSearchable }
        controlLabel={ label }
        components={ {
          Control: label ? Control : components.Control,
          Option: Option
        } }
        hideSelectedOptions={ false }
        closeMenuOnSelect={ isMulti ? false : true }
      />
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
