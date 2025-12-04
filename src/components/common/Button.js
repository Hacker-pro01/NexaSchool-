import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'; // Assuming you have a CSS file for button styles

const Button = ({ variant, isLoading, children, ...props }) => {
    const buttonClass = `button ${variant} ${isLoading ? 'loading' : ''}`;

    return (
        <button className={buttonClass} disabled={isLoading} aria-busy={isLoading} {...props}>
            {isLoading ? 'Loading...' : children}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger']).isRequired,
    isLoading: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

Button.defaultProps = {
    isLoading: false,
};

export default Button;
