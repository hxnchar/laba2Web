import React from 'react';

export const Input = ({ placeholder, type, label, value, setValue }) => (
  <>
    <label>{label}</label>
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  </>
);
