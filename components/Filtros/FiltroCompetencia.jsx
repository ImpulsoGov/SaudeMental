import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Select, { components } from 'react-select';
import styles from './Filtros.module.css';

const FiltroCompetencia = ({ dados, label, valor, setValor, isMulti, isSearchable, width }) => {
  const options = useMemo(() => {
    const competencias = [];

    dados.forEach(({ periodo, competencia }) => {
      const periodoEncontrado = competencias
        .find((item) => item.periodo === periodo);

      if (!periodoEncontrado) {
        competencias.push({ periodo, competencia });
      }
    });

    return competencias
      .sort((a, b) => new Date(b.competencia) - new Date(a.competencia))
      .map(({ periodo }) => ({ value: periodo, label: periodo }));
  }, [dados]);

  const getOptionPersonalizada = ({ children, ...props }) => (
    <components.Control { ...props } >
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
        components={ { Control: label ? getOptionPersonalizada : components.Control } }
        styles={ label && { control: (css) => ({ ...css, paddingLeft: '15px' }) } }
      />
    </div>
  );
};

FiltroCompetencia.defaultProps = {
  isMulti: false,
  isSearchable: false,
  width: '50%'
};

FiltroCompetencia.propTypes = {
  dados: PropTypes.arrayOf(PropTypes.shape({
    periodo: PropTypes.string,
    competencia: PropTypes.string
  })).isRequired,
  valor: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  setValor: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string
};

export default FiltroCompetencia;
