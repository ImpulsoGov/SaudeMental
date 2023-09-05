import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import styles from './Filtros.module.css';

const InputOption = ({
  getStyles,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = 'transparent';
  if (isFocused) bg = '#deebff';
  if (isActive) bg = '#B2D4FF';

  const style = {
    alignItems: 'center',
    backgroundColor: bg,
    color: 'inherit',
    display: 'flex ',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <input type='checkbox' checked={isSelected} style={{ marginRight: '8px' }} />
        {children}
      </div>

      <span>{rest.data.periodo_ordem.toFixed(2)}</span>
    </components.Option>
  );
};

const FiltroCompetencia = ({ dados, valor, setValor, isMulti, isSearchable, width }) => {
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
    <components.Control { ...props }>
      Competência: { children }
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
        styles={ {
          control: (css) => ({ ...css, paddingLeft: '15px' }),
        } }
        hideSelectedOptions={ false }
        closeMenuOnSelect={ false }
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
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default FiltroCompetencia;
