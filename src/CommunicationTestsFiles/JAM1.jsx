import React from 'react';
import BaseComponent from './BaseComponent';

export default function JAM1() {
    return (
        <BaseComponent
            testType="jam"
            testTitle="JAM Test"
            testDescription="JAM speaking sessions to improve spontaneous communication"
            apiEndpoint="https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/jamagent-test"
            useRecordingAPI={true}
            onTimeRecording={true}
        />
    );
}