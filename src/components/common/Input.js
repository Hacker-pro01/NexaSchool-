import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ type, placeholder, value, onChange, className }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

Input.defaultProps = {
    type: 'text',
    placeholder: '',
    value: '',
    className: '',
};

export default Input;
