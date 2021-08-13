import ReactSelect from 'react-select';

const selectStyles = (height) => ({
   control: (provided, state) => {
      provided.borderColor = state.menuIsOpen ? '#44bdec' : 'hsl(0, 0%, 80%)';
      provided.boxShadow = state.menuIsOpen ? '0 0 0 1px #44bdec' : '';
      provided['&:hover'] = { borderColor: '#44bdec' };
      provided.justifyContent = 'center';
      provided.paddingTop = '0.2rem';
      provided.paddingBottom = '0.2rem';
      provided.height = height;

      console.log(provided);

      return provided;
   },
   valueContainer: (provided, state) => {
      provided.justifyContent = 'center';

      return provided;
   },
   menu: (provided, state) => {
      provided.textAlign = 'center';
      return provided;
   },
   option: (provided, state) => {
      provided.backgroundColor = state.isSelected || state.isFocused ? '#44bdec' : 'transparent';

      if (state.isFocused) provided.color = 'white';
      return provided;
   },
});

const Select = ({ width = 'tw-w-[100px]', className = '', height = '36px', ...props }) => (
   <ReactSelect
      menuPlacement="auto"
      className={`${width} ${className}`}
      styles={() => selectStyles(height)}
      {...props}
   />
);

export default Select;
