import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export function EmailTemplate({ name, email, message }: EmailTemplateProps) {
  return (
    <div>
      <h1>New Project Request Received</h1>
      <p>Someone just dropped a new project request.</p>

      <div style={{ margin: "24px 0" }}>
        <h2>Customer Details:</h2>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
      </div>

      <div style={{ margin: "24px 0" }}>
        <h2>Message:</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
      </div>

      <hr
        style={{
          margin: "24px 0",
          border: "none",
          borderTop: "1px solid #eaeaea",
        }}
      />

      <p style={{ color: "#666", fontSize: "14px" }}>
        This is an automated email from the cuttypie website, project request
        service.
      </p>
    </div>
  );
}
