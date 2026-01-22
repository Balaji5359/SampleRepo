import React from 'react';
import BaseComponent from './BaseComponent';

export default function Pronunciation() {
    return (
        <BaseComponent
            testType="pronu"
            testTitle="Pronunciation Test"
            testDescription="Test your pronunciation accuracy with 5 sentences"
            testLevel="basic"
            testDuration={600}
            apiEndpoint="https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/prounagent-test"
            recordingMode="short"
            autoStartMessage="hi"
        />
    );
}