import React from 'react';
import BaseComponent from './BaseComponent';

export default function Listening() {
    return (
        <BaseComponent
            testType="listen"
            testTitle="Listening Test"
            testDescription="Test your listening skills by listen and speaking of 5 sentences"
            apiEndpoint="https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/listenagent-test"
            useRecordingAPI={false}
            onTimeRecording={true}
        />
    );
}