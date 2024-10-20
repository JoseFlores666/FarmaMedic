import PropTypes from 'prop-types';

const Input = ({ type, id, name, value, onChange, required, placeholder,maxLength, min, max}) => {
  return (
    <input
      type={type}
      id={id}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
      max={max}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  maxLength:PropTypes.number,
  min: PropTypes.number,
  max:PropTypes.number
};

export default Input;
