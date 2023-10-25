import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Select, { components } from 'react-select';
import Control from './Control';
import styles from './Filtros.module.css';
import Option from './Option';

const FiltroTexto = ({ dados, label, propriedade, valor, setValor, isMulti, isSearchable, width }) => {
  const options = useMemo(() => {
    const valoresUnicos = new Set();

    dados.forEach((dado) => {
      if (dado[propriedade] !== null) {
        valoresUnicos.add(dado[propriedade]);
      }
    });

    return [...valoresUnicos]
      .sort((a, b) => a.localeCompare(b))
      .map((valor) => ({
        value: valor,
        label: valor
      }));
  }, [dados, propriedade]);

  return (
    <div
      className={ styles.Filtro }
      style={{ width }}
    >
      <Select
        options={ options }
        defaultValue={ valor }
        selectedValue={ valor }
        onChange={ (selected) => setValor(selected) }
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

FiltroTexto.defaultProps = {
  isMulti: false,
  isSearchable: false,
  width: '50%'
};

FiltroTexto.propTypes = {
  propriedade: PropTypes.string.isRequired,
  valor: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  setValor: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
};

export default FiltroTexto;
