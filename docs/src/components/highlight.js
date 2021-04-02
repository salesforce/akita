import React from 'react';

export const Highlight = ({ children, bgColor, color }) => (
  <span
    style={{
      backgroundColor: bgColor || '#f5f6f7',
      borderRadius: '2px',
      color: color || 'rgb(153, 76, 195)',
      padding: '3.2px 6.4px'
    }}
  >
    {' '}
    {children}{' '}
  </span>
);
