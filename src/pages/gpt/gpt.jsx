import React from 'react';
import "./gpt.css";

function Gpt() {
  return (
    <div className="gpt-container">
      <iframe
        src="http://localhost:8501"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="Clubo Chat-Bot"
      ></iframe>
    </div>
  );
}

export default Gpt;

