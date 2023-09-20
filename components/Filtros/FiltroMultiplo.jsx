import React, { useEffect, useRef } from 'react';
import Select from 'react-select';

// Referência:
// https://codesandbox.io/s/distracted-panini-8458i?file=/src/MultiSelect.js:567-589
const FiltroMultiplo = ({
  valor,
  options,
  setValor,
  components,
  controlLabel,
  isSearchable,
  showAllOption,
  labelAllOption,
  isDefaultAllOption,
}) => {
  const valueRef = useRef(valor);
  valueRef.current = valor;

  const selectAllOption = {
    value: '<SELECT_ALL>',
    label: labelAllOption
  };

  useEffect(() => {
    if (isDefaultAllOption && showAllOption) {
      setValor(options);
    }
  }, [isDefaultAllOption, options, setValor, showAllOption]);

  const isSelectAllSelected = () =>
    valueRef.current.length === options.length;

  const isOptionSelected = option =>
    valueRef.current.some(({ value }) => value === option.value) ||
      isSelectAllSelected();

  const getOptions = () => showAllOption ? [selectAllOption, ...options] : options;

  const getValue = () =>
    isSelectAllSelected() ? [selectAllOption] : valor;

  const handleChange = (newValue, actionMeta) => {
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

  return (
    <Select
      isOptionSelected={ isOptionSelected }
      options={ getOptions() }
      value={getValue()}
      defaultValue={ valor }
      selectedValue={ valor }
      onChange={ handleChange }
      isMulti={ true }
      isSearchable={ isSearchable }
      controlLabel={ controlLabel }
      components={ components }
      hideSelectedOptions={ false }
      closeMenuOnSelect={ false }
    />
  );
};

export default FiltroMultiplo;
