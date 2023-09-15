import { useState } from 'react';
import { components } from 'react-select';

// Referências:
// https://codesandbox.io/s/react-select-with-checkboxes-bedj8
// https://codesandbox.io/s/react-multi-select-example-with-select-all-option-and-checkboxes-ejjc9?file=/src/MultiSelect.tsx:2176-2189

const Option = (props) => {
  const {
    isMulti,
    getStyles,
    isDisabled,
    isFocused,
    isSelected,
    children,
    innerProps,
    data: { descricaoPeriodo }
  } = props;

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
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <components.Option
      { ...props }
      isDisabled={ isDisabled }
      isFocused={ isFocused }
      isSelected={ isSelected }
      getStyles={ getStyles }
      innerProps={ {
        ...innerProps,
        onMouseDown,
        onMouseUp,
        onMouseLeave,
        style
      } }
    >
      {isMulti &&
        <input
          type='checkbox'
          checked={ isSelected }
          onChange={ () => {} }
          name='filtro-checkbox'
        />
      }

      {children}

      {descricaoPeriodo && <span>{descricaoPeriodo}</span>}
    </components.Option>
  );
};

export default Option;
