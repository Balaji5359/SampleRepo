import React from 'react';
import BaseDashboard from './BaseDashboard';

function SituationSpeakDashboard() {
  return (
    <BaseDashboard
      testType="situational"
      testTitle="Situation Speak"
      testDescription="Practice speaking in different scenarios"
      apiTestType="SITUATIONSPEAK"
    >
      <div></div>
    </BaseDashboard>
  );
}

export default SituationSpeakDashboard;