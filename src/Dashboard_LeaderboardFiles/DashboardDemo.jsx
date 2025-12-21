import React from 'react';
import Dashboard from './Dashboard.jsx';

// Demo component to showcase the Dashboard functionality
function DashboardDemo() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #071028 0%, #07182b 60%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <h2 style={{
          color: '#e6eef8',
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: 'Inter, sans-serif'
        }}>
          Dashboard Demo - Navigate through History and Analytics
        </h2>
        <Dashboard />
      </div>
    </div>
  );
}
export default DashboardDemo;