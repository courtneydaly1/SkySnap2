import React from "react";

/**
 * Alert component to display messages (e.g., error or success) with customizable type.
 * 
 * Props:
 * - type: Specifies the alert type, e.g., "danger", "success", "warning".
 * - messages: An array of message strings to display.
 */
function Alert({ type = "danger", messages = [] }) {
  console.debug("Alert", "type=", type, "messages=", messages);

  // Validate type to ensure it's a valid Bootstrap alert type
  const validAlertTypes = ["danger", "success", "warning", "info"];
  const alertType = validAlertTypes.includes(type) ? type : "danger";

  return (
    <div 
      className={`alert alert-${alertType}`} 
      role="alert" 
      aria-live="assertive"  // Make alert more accessible
    >
      {messages.map((error, index) => (
        <p className="mb-0 small" key={index}>
          {error}
        </p>
      ))}
    </div>
  );
}

export default Alert;
