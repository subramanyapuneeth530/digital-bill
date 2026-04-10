import React from 'react';

export default function Dashboard() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 className="text-gradient">Staff Dashboard</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
        Live orders and table statuses will appear here. (Phase 5 implementation)
      </p>
    </div>
  );
}
