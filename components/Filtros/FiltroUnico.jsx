import React from 'react';
import Select from 'react-select';

const FiltroUnico = ({
  valor,
  options,
  setValor,
  components,
  controlLabel,
  isSearchable,
}) => {
  const handleChange = (selected) => setValor(selected);

  return (
    <Select
      options={ options }
      defaultValue={ valor }
      selectedValue={ valor }
      onChange={ handleChange }
      isMulti={ false }
      isSearchable={ isSearchable }
      controlLabel={ controlLabel }
      components={ components }
      hideSelectedOptions={ false }
      closeMenuOnSelect={ true }
    />
  );
};

export default FiltroUnico;
