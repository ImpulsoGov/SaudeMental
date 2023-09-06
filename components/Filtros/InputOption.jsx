import { useState } from 'react';
import { components } from 'react-select';
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
  const { isMulti, data: { periodo_ordem: periodoOrdem } } = rest;
  const [isActive, setIsActive] = useState(false);

  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  let bg = 'transparent';
  let color = '#000000';

  if (isFocused) bg = '#deebff';
  if (isActive) bg = '#B2D4FF';
  if (isSelected && !isMulti) {
    bg = '#2684ff';
    color = '#ffffff';
  }

  const style = {
    alignItems: 'center',
    backgroundColor: bg,
    color,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      { ...rest }
      isDisabled={ isDisabled }
      isFocused={ isFocused }
      isSelected={ isSelected }
      getStyles={ getStyles }
      innerProps={ props }
    >
      <div className={ styles.InputOption }>
        {isMulti &&
          <input
            type='checkbox'
            checked={ isSelected }
            className={ styles.InputOptionCheckbox }
          />
        }

        {children}
      </div>

      {periodoOrdem && <span>{periodoOrdem.toFixed(2)}</span>}
    </components.Option>
  );
};

export default InputOption;
