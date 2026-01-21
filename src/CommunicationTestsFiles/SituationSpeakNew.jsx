import React from 'react';
import BaseComponent from './BaseComponent';

export default function SituationSpeak() {
    return (
        <BaseComponent
            testType="situational"
            testTitle="Situational Speaking"
            testDescription="Practice real-life scenarios to build confidence"
            apiEndpoint="https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/situationagent-test"
            useRecordingAPI={true}
            onTimeRecording={true}
        />
    );
}