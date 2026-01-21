import React from 'react';
import BaseDashboard from './BaseDashboard';

function PronunciationDashboard() {
  return (
    <BaseDashboard
      testType="pronunciation"
      testTitle="Pronunciation"
      testDescription="Perfect your pronunciation with AI-powered feedback"
      apiTestType="PRONUNCIATION"
    >
      <div></div>
    </BaseDashboard>
  );
}

export default PronunciationDashboard;