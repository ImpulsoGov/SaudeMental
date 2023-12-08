import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { components } from 'react-select';
import Control from './Control';
import styles from './Filtros.module.css';
import Option from './Option';
import { SelectMultiplo, SelectUnico } from './index';

const FiltroTexto = ({
  dados,
  label,
  propriedade,
  valor,
  setValor,
  isMulti,
  isSearchable,
  width,
  labelAllOption,
  showAllOption,
  isDefaultAllOption
}) => {
  const options = useMemo(() => {
    const valoresUnicos = new Set();

    dados.forEach((dado) => {
      if (dado[propriedade]) {
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

FiltroTexto.defaultProps = {
  isMulti: false,
  isSearchable: false,
  width: '50%',
  labelAllOption: 'Todos',
  showAllOption: false,
  isDefaultAllOption: false
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
  labelAllOption: PropTypes.string,
  showAllOption: PropTypes.bool,
  isDefaultAllOption: PropTypes.bool
};

export default FiltroTexto;
