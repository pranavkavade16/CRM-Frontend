const BadgePill = ({ text, color = 'secondary', className = '' }) => {
  return (
    <span
      className={`badge rounded-pill bg-${color} badge-soft ${className}`}
      style={{ padding: '0.5rem' }}
    >
      {text}
    </span>
  );
};

export default BadgePill;
