import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Select, { components } from 'react-select';
import styles from './Filtros.module.css';
import InputOption from './InputOption';

const FiltroTexto = ({ dados, label, propriedade, valor, setValor, isMulti, isSearchable, width }) => {
  const options = useMemo(() => {
    const valoresUnicos = new Set();

    dados.forEach((dado) => {
      valoresUnicos.add(dado[propriedade]);
    });

    return [...valoresUnicos]
      .sort((a, b) => a.localeCompare(b))
      .map((valor) => ({
        value: valor,
        label: valor
      }));
  }, [dados, propriedade]);

  const getOptionPersonalizada = ({ children, ...props }) => (
    <components.Control { ...props }>
      {`${label}`}: { children }
    </components.Control>
  );

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
        components={ {
          Control: getOptionPersonalizada,
          Option: InputOption
        } }
        styles={ { control: (css) => ({ ...css, paddingLeft: '15px' }) } }
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
  label: PropTypes.string.isRequired,
  propriedade: PropTypes.string.isRequired,
  valor: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  setValor: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default FiltroTexto;
