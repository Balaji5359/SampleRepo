import React, { useState, useEffect } from 'react';
import TestList from './TestList';
import TestModal from './TestModal';
import './dashboard-styles.css';
import './advanced-dashboard.css';
import './modern-graphs.css';

const AdvancedDashboard = ({ testType, userEmail, onBack }) => {
    const [tests, setTests] = useState([]);
    const [filteredTests, setFilteredTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sessionDetails, setSessionDetails] = useState({});

    useEffect(() => {
        fetchTests();
    }, [testType, userEmail]);

    useEffect(() => {
        const filtered = tests.filter(test => 
            test.sessionId.toLowerCase().includes(filterText.toLowerCase()) ||
            formatDate(test.start_time).toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredTests(filtered);
    }, [tests, filterText]);

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return 'Not available';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleDateString('en-IN');
        } catch (error) {
            return dateTimeString;
        }
    };

    const fetchTests = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_idretrivalapi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    college_email: userEmail,
                    test_type: testType
                })
            });
            
            const data = await response.json();
            if (data.body) {
                const testsData = JSON.parse(data.body);
                setTests(testsData.sessions || []);
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTestClick = async (test) => {
        // Disable body scroll when modal opens
        document.body.style.overflow = 'hidden';
        
        if (sessionDetails[test.sessionId]) {
            setSelectedTest({ ...test, ...sessionDetails[test.sessionId] });
            return;
        }

        try {
            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_dataretrivalapi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    college_email: userEmail,
                    test_type: testType,
                    sessionId: test.sessionId
                })
            });
            
            const data = await response.json();
            const parsedData = JSON.parse(data.body);
            
            setSessionDetails(prev => ({ ...prev, [test.sessionId]: parsedData }));
            setSelectedTest({ ...test, ...parsedData });
        } catch (error) {
            console.error('Error fetching test details:', error);
        }
    };

    const closeModal = () => {
        // Re-enable body scroll when modal closes
        document.body.style.overflow = 'unset';
        setSelectedTest(null);
    };

    return (
        <div className="advanced-dashboard">
            <div className="dashboard-header">
                <button onClick={onBack} className="back-btn">Click here ← to Close</button>
            </div>

            <div className="filter-section">
                <input
                    type="text"
                    placeholder="Filter tests by Session ID or date..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="filter-input"
                />
            </div>

            {loading ? (
                <div className="loading">Loading tests...</div>
            ) : (
                <TestList 
                    tests={filteredTests}
                    onTestClick={handleTestClick}
                />
            )}

            {selectedTest && (
                <TestModal 
                    test={selectedTest}
                    onClose={closeModal}
                    testType={testType}
                    userEmail={userEmail}
                />
            )}
        </div>
    );
};

export default AdvancedDashboard;