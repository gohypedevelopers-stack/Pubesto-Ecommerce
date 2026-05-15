import React from 'react';

export default function PolicyLayout({ title, children }) {
  return (
    <main className="policy-page">
      <div className="policy-accent-glow" />
      <div className="policy-container">
        <div className="policy-header">
          <p className="policy-eyebrow">Legal Information</p>
          <h1>{title}</h1>
          <div className="policy-divider" />
        </div>
        <div className="policy-body">
          {children}
        </div>
        <div className="policy-footer">
          <p>For further assistance, please contact us at support@pubesto.com</p>
        </div>
      </div>
    </main>
  );
}
