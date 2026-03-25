import React from "react";
import "../../styles/components/_tooltip.css";
function Tooltip({ text, children, position = "top" }) {
  return (
    <div className={`tooltip-wrapper ${position}`}>
      {children}
      <span className="tooltip-text">{text}</span>
    </div>
  );
}

export default Tooltip;
