import { components } from 'react-select';

const Control = (props) => {
  const {
    children,
    innerProps,
    selectProps: { controlLabel }
  } = props;

  const style = {
    paddingLeft: '15px'
  };

  return (
    <components.Control
      { ...props }
      innerProps={ {
        ...innerProps,
        style
      } }
    >
      {`${controlLabel}`}: { children }
    </components.Control>
  );
};

export default Control;
