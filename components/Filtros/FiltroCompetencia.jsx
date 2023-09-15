import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import Select, { components } from 'react-select';
import Control from './Control';
import styles from './Filtros.module.css';
import Option from './Option';

const FiltroCompetencia = ({
  dados,
  label,
  valor,
  setValor,
  isMulti,
  isSearchable,
  width
}) => {
  const obterPeriodoFormatado = useCallback((competencia, nomeMes) => {
    const abreviacaoMes = nomeMes.slice(0, 3);
    const ano = new Date(competencia).getUTCFullYear();

    return `${abreviacaoMes}/${ano}`;
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
