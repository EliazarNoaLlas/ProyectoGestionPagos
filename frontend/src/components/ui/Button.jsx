// src/components/ui/Button.jsx
import PropTypes from "prop-types";

export const Button = ({ children, onClick, variant = "default", size = "md", disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded font-medium focus:outline-none transition-all";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-100",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  const sizes = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["default", "outline", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool
};