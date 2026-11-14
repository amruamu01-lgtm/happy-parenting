import React from 'react';

export default function OrnamentalDivider({ className = '', light = false }) {
  const strokeColor = light ? '#E59C5A' : '#D9883F'; // Warm Orange
  const fillColor = light ? '#D9883F' : '#952F2F';   // Warm Orange / Burgundy

  return (
    <div className={`flex items-center justify-center space-x-3 my-4 ${className}`}>
      <div 
        className="h-[1px] w-12 sm:w-20" 
        style={{ background: `linear-gradient(to right, transparent, ${strokeColor}, transparent)` }} 
      />
      
      <div className="flex items-center space-x-1.5">
        <span 
          className="w-1.5 h-1.5 rotate-45 border inline-block" 
          style={{ borderColor: strokeColor, backgroundColor: fillColor }} 
        />
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            fill="none" 
          />
          <circle cx="12" cy="12" r="2.5" fill={strokeColor} />
        </svg>
        <span 
          className="w-1.5 h-1.5 rotate-45 border inline-block" 
          style={{ borderColor: strokeColor, backgroundColor: fillColor }} 
        />
      </div>

      <div 
        className="h-[1px] w-12 sm:w-20" 
        style={{ background: `linear-gradient(to left, transparent, ${strokeColor}, transparent)` }} 
      />
    </div>
  );
}
