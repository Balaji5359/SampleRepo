import React from 'react';
import BaseComponent from './BaseComponent';

export default function Pronunciation1() {
    return (
        <BaseComponent
            testType="pronu"
            testTitle="Pronunciation Test"
            testDescription="Test your pronunciation accuracy with 5 sentences"
            apiEndpoint="https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/prounagent-test"
            useRecordingAPI={false}
            onTimeRecording={true}
        />
    );
}