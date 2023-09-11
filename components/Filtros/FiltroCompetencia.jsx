import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Select, { components } from 'react-select';
import styles from './Filtros.module.css';
import InputOption from './InputOption';

const FiltroCompetencia = ({
  dados,
  label,
  valor,
  setValor,
  isMulti,
  isSearchable,
  width
}) => {
  const options = useMemo(() => {
    const competencias = [];

    dados.forEach(({ periodo, competencia, periodo_ordem }) => {
      const periodoEncontrado = competencias
        .find((item) => item.periodo === periodo);

      if (!periodoEncontrado) {
        competencias.push({ periodo, competencia, periodo_ordem });
      }
    });

    return competencias
      .sort((a, b) => new Date(b.competencia) - new Date(a.competencia))
      .map(({ periodo, periodo_ordem }) => ({ value: periodo, label: periodo, periodo_ordem }));
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
        components={ {
          Control: label ? getOptionPersonalizada : components.Control,
          Option: InputOption
        } }
        styles={ label && {
          control: (css) => ({ ...css, paddingLeft: '15px' }),
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
  width: '50%'
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
  label: PropTypes.string
};

export default FiltroCompetencia;
