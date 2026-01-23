import React, { useState } from 'react';

const TestCompletionHandler = ({ 
    aiResponse, 
    sessionId, 
    testType, 
    testLevel, 
    onComplete 
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const extractTestData = (response) => {
        const data = {
            finalScore: 0,
            feedback: response,
            reportType: ''
        };

        // Extract JAM test data
        if (response.includes('JAM Score:')) {
            const scoreMatch = response.match(/JAM Score:\s*(\d+\.?\d*)\s*\/\s*10\.0/);
            data.finalScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
            data.reportType = 'JAM';
        }
        
        // Extract Pronunciation test data
        else if (response.includes('Final Speaking Score:')) {
            const scoreMatch = response.match(/Final Speaking Score:\s*(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/);
            data.finalScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
            data.reportType = 'Pronunciation';
        }
        
        // Extract Listening test data
        else if (response.includes('Final Listening Score:')) {
            const scoreMatch = response.match(/Final Listening Score:\s*(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/);
            data.finalScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
            data.reportType = 'Listening';
        }
        
        // Extract Situational test data
        else if (response.includes('Situational Score:')) {
            const scoreMatch = response.match(/Situational Score:\s*(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/);
            data.finalScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
            data.reportType = 'Situational';
        }

        return data;
    };

    const formatFinalReport = (response, reportType) => {
        let formattedResponse = response;

        // JAM Test formatting
        if (reportType === 'JAM') {
            formattedResponse = formattedResponse
                .replace(/ASSESSMENT REPORT/g, '<div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 20px; border-radius: 15px; font-weight: 700; font-size: 22px; margin: 20px 0; text-align: center; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);">🎯 ASSESSMENT REPORT</div>')
                .replace(/TOPIC:/g, '<div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">📝 TOPIC:</div>')
                .replace(/CRITICAL ISSUE:/g, '<div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">⚠️ CRITICAL ISSUE:</div>')
                .replace(/PERFORMANCE SUMMARY:/g, '<div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">📊 PERFORMANCE SUMMARY:</div>')
                .replace(/DETAILED EVALUATION:/g, '<div style="background: linear-gradient(135deg, #7c2d12 0%, #92400e 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🔍 DETAILED EVALUATION:</div>')
                .replace(/CRITICAL IMPROVEMENTS REQUIRED:/g, '<div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🎯 CRITICAL IMPROVEMENTS REQUIRED:</div>')
                .replace(/PLACEMENT READINESS:/g, '<div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🏆 PLACEMENT READINESS:</div>');
        }

        // Pronunciation Test formatting
        else if (reportType === 'Pronunciation') {
            formattedResponse = formattedResponse
                .replace(/FINAL SPEAKING ASSESSMENT REPORT/g, '<div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 20px; border-radius: 15px; font-weight: 700; font-size: 22px; margin: 20px 0; text-align: center; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);">🎤 FINAL SPEAKING ASSESSMENT REPORT</div>')
                .replace(/OVERALL PERFORMANCE SUMMARY:/g, '<div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 14px 18px; border-radius: 10px; font-weight: 700; font-size: 16px; margin: 12px 0;">📊 OVERALL PERFORMANCE SUMMARY:</div>')
                .replace(/COMPREHENSIVE SCORES:/g, '<div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">📋 COMPREHENSIVE SCORES:</div>')
                .replace(/DETAILED ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #7c2d12 0%, #92400e 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🔍 DETAILED ANALYSIS:</div>')
                .replace(/STRENGTHS IDENTIFIED:/g, '<div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">💪 STRENGTHS IDENTIFIED:</div>')
                .replace(/PROFESSIONAL RECOMMENDATIONS:/g, '<div style="background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🎯 PROFESSIONAL RECOMMENDATIONS:</div>');
        }

        // Listening Test formatting
        else if (reportType === 'Listening') {
            formattedResponse = formattedResponse
                .replace(/COMPREHENSIVE LISTENING ASSESSMENT REPORT/g, '<div style="background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 15px; font-weight: 700; font-size: 22px; margin: 20px 0; text-align: center; box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4);">🎧 COMPREHENSIVE LISTENING ASSESSMENT REPORT</div>')
                .replace(/OVERALL LISTENING PERFORMANCE:/g, '<div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 14px 18px; border-radius: 10px; font-weight: 700; font-size: 16px; margin: 12px 0;">📊 OVERALL LISTENING PERFORMANCE:</div>')
                .replace(/DETAILED LISTENING SCORES:/g, '<div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">📋 DETAILED LISTENING SCORES:</div>')
                .replace(/COMPREHENSIVE ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #7c2d12 0%, #92400e 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🔍 COMPREHENSIVE ANALYSIS:</div>')
                .replace(/LISTENING STRENGTHS:/g, '<div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">💪 LISTENING STRENGTHS:</div>')
                .replace(/CRITICAL LISTENING DEFICIENCIES:/g, '<div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">⚠️ CRITICAL LISTENING DEFICIENCIES:</div>')
                .replace(/PROFESSIONAL LISTENING RECOMMENDATIONS:/g, '<div style="background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🎯 PROFESSIONAL LISTENING RECOMMENDATIONS:</div>')
                .replace(/LISTENING READINESS:/g, '<div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🏆 LISTENING READINESS:</div>');
        }

        // Situational Test formatting
        else if (reportType === 'Situational') {
            formattedResponse = formattedResponse
                .replace(/SITUATIONAL ASSESSMENT REPORT/g, '<div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 20px; border-radius: 15px; font-weight: 700; font-size: 22px; margin: 20px 0; text-align: center; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);">🎭 SITUATIONAL ASSESSMENT REPORT</div>')
                .replace(/SCENARIO:/g, '<div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">📝 SCENARIO:</div>')
                .replace(/RESPONSE ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">📊 RESPONSE ANALYSIS:</div>')
                .replace(/DETAILED EVALUATION:/g, '<div style="background: linear-gradient(135deg, #7c2d12 0%, #92400e 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🔍 DETAILED EVALUATION:</div>')
                .replace(/INTERVIEW READINESS ASSESSMENT:/g, '<div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🎯 INTERVIEW READINESS ASSESSMENT:</div>')
                .replace(/PLACEMENT EVALUATION:/g, '<div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0;">🏆 PLACEMENT EVALUATION:</div>');
        }

        return formattedResponse;
    };

    const submitTestResults = async () => {
        setIsProcessing(true);
        
        try {
            const testData = extractTestData(aiResponse);
            const email = localStorage.getItem('email');
            
            // Map test types to API format
            const testTypeMap = {
                'jam': 'jam_test',
                'pronunciation': 'pronu_test',
                'listening': 'listen_test',
                'situation': 'situation_test',
                'image-speak': 'image_speak'
            };

            // Submit test results
            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/comm-test-feedback-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    college_email: email,
                    test_type: testTypeMap[testType],
                    test_level: testLevel,
                    test_id: sessionId,
                    final_score: testData.finalScore,
                    ai_feedback: testData.feedback
                })
            });

            if (response.ok) {
                // Update streak
                await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/update-user-streak', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        body: JSON.stringify({ college_email: email })
                    })
                });
            }
        } catch (error) {
            console.error('Error submitting test results:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    React.useEffect(() => {
        if (aiResponse && (
            aiResponse.includes('ASSESSMENT REPORT') ||
            aiResponse.includes('FINAL SPEAKING ASSESSMENT REPORT') ||
            aiResponse.includes('COMPREHENSIVE LISTENING ASSESSMENT REPORT') ||
            aiResponse.includes('SITUATIONAL ASSESSMENT REPORT')
        )) {
            submitTestResults();
        }
    }, [aiResponse]);

    return null;
};

export default TestCompletionHandler;