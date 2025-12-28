// Updated API structure for all dashboard components

// 1. Add sessionDetails state
const [sessionDetails, setSessionDetails] = useState({});

// 2. Update API call to use ID retrieval endpoint
const fetchTestData = async () => {
  if (!userEmail) return;
  
  setLoading(true);
  try {
    const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_idretrivalapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        college_email: userEmail,
        test_type: 'TEST_TYPE' // Replace with: JAM, SITUATIONSPEAK, PRONUNCIATION, LISTENING, IMAGETOSPEAK, IMAGETOSTORY
      })
    });
    
    const data = await response.json();
    const parsedData = JSON.parse(data.body);
    setApiData(parsedData);
  } catch (error) {
    console.error('Error fetching test data:', error);
  } finally {
    setLoading(false);
  }
};

// 3. Add function to fetch detailed session data
const fetchSessionDetails = async (sessionId) => {
  if (sessionDetails[sessionId]) {
    setSelectedSession({ ...apiData.sessions.find(s => s.sessionId === sessionId), ...sessionDetails[sessionId] });
    return;
  }

  try {
    const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_dataretrivalapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        college_email: userEmail,
        test_type: 'TEST_TYPE', // Replace with appropriate test type
        sessionId: sessionId
      })
    });
    
    const data = await response.json();
    const parsedData = JSON.parse(data.body);
    
    setSessionDetails(prev => ({ ...prev, [sessionId]: parsedData }));
    setSelectedSession({ ...apiData.sessions.find(s => s.sessionId === sessionId), ...parsedData });
  } catch (error) {
    console.error('Error fetching session details:', error);
  }
};

// 4. Update session card onClick to use fetchSessionDetails
onClick={() => fetchSessionDetails(session.sessionId)}

// Test type mappings for API calls:
// JAM -> 'JAM'
// Situation Speak -> 'SITUATIONSPEAK' 
// Pronunciation -> 'PRONUNCIATION'
// Listening -> 'LISTENING'
// Image Speak -> 'IMAGETOSPEAK'
// Image Story -> 'IMAGETOSTORY'