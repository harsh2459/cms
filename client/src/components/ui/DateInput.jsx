import { useState } from 'react';

export default function DateInput({ value, onChange, placeholder, required, className, min, max }) {
  const [type, setType] = useState('text');
  
  // Convert standard YYYY-MM-DD to DD/MM/YYYY for text display
  let displayValue = '';
  if (value) {
    const parts = value.split('-');
    if (parts.length === 3) {
      displayValue = `${parts[2]}/${parts[1]}/${parts[0]}`;
    } else {
      displayValue = value;
    }
  }

  return (
    <input
      type={type}
      className={className || "input"}
      required={required}
      placeholder={placeholder || "dd/mm/yyyy"}
      value={type === 'date' ? value : displayValue}
      min={min}
      max={max}
      onFocus={(e) => {
        setType('date');
        // Optionally trigger the native picker on focus if supported
        try {
          if (e.target.showPicker) e.target.showPicker();
        } catch (err) { /* ignore */ }
      }}
      onBlur={() => setType('text')}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
