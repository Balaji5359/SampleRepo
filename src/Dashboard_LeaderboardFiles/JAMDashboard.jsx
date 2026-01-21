import React from 'react';
import BaseDashboard from './BaseDashboard';

function JAMDashboard() {
  return (
    <BaseDashboard
      testType="jam"
      testTitle="JAM Sessions"
      testDescription="Self-analyze your Just A Minute sessions"
      apiTestType="JAM"
    >
      <div></div>
    </BaseDashboard>
  );
}

export default JAMDashboard;