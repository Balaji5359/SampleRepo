# Dashboard Component

A comprehensive dashboard component for the AI Skill Development platform with modern design and responsive layout.

## Features

### 🏠 Main Dashboard
- **Statistics Overview**: Displays key metrics including total sessions, average score, practice time, and skills improved
- **Modern Card Design**: Clean, gradient-based cards with hover effects
- **Action Buttons**: Easy navigation to History and Analytics sections

### 📊 History Section
- **Session List**: Complete list of all communication activities
- **Session Details**: Shows session ID, type, date, time, score, and duration
- **Interactive Cards**: Click on any session to view detailed conversation
- **Session Types**: Practice Test, Speaking Assessment, Pronunciation Practice

### 📈 Analytics Section
- **Performance Trends**: Visual representation of progress over time
- **Session Analysis**: Quick overview of all sessions with scores
- **Clickable Sessions**: Access detailed analytics for each session

### 💬 Conversation Modal
- **Full Conversation**: Complete chat history between user and AI
- **Session Analytics**: Detailed metrics including:
  - Overall Score
  - Pronunciation Score
  - Fluency Score
  - Confidence Score
- **Transcript**: Full text transcript of the conversation
- **Audio Support**: Ready for audio playback integration

## Design Features

### 🎨 Modern UI/UX
- **Dark Theme**: Professional dark gradient background
- **Color Scheme**: 
  - Primary: `#0f1724` (Dark blue)
  - Secondary: `#0b1220` (Darker blue)
  - Accent: `#60a5fa` (Blue)
  - Success: `#10b981` (Green)
  - Text: `#e6eef8` (Light blue-white)
  - Muted: `#94a3b8` (Gray)

### 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapts to tablet screen sizes
- **Desktop Ready**: Full desktop experience
- **Flexible Grid**: Auto-adjusting layouts

### ✨ Interactive Elements
- **Hover Effects**: Smooth transitions and animations
- **Click Feedback**: Visual feedback for user interactions
- **Modal System**: Clean popup for detailed views
- **Smooth Navigation**: Seamless section transitions

## Component Structure

```
Dashboard.jsx
├── Main Dashboard View
│   ├── Header with title and subtitle
│   ├── Statistics cards (4 metrics)
│   └── Action buttons (History & Analytics)
├── History Section
│   ├── Session list with details
│   └── Click handlers for conversations
├── Analytics Section
│   ├── Performance trends placeholder
│   └── Session analytics list
└── Conversation Modal
    ├── Message history
    ├── Analytics metrics
    └── Transcript display
```

## Usage

```jsx
import Dashboard from './Dashboard_LeaderboardFiles/Dashboard.jsx';

function App() {
  return <Dashboard />;
}
```

## Routes

The dashboard is accessible via:
- `/student-dashboard` - Main dashboard route (protected)

## Data Structure

### Session Data
```javascript
{
  id: 'session_001',
  date: '2024-01-15',
  time: '14:30',
  type: 'Practice Test',
  score: 85,
  duration: '15 min'
}
```

### Conversation Data
```javascript
{
  messages: [
    {
      sender: 'AI' | 'User',
      text: 'Message content',
      time: '14:30:01'
    }
  ],
  analytics: {
    overallScore: 85,
    pronunciation: 82,
    fluency: 88,
    confidence: 85,
    transcript: 'Full conversation transcript'
  }
}
```

## Customization

### Colors
Modify CSS variables in `Dashboard.css`:
```css
:root {
  --bg-primary: #0f1724;
  --accent-blue: #60a5fa;
  --accent-green: #10b981;
  /* ... other variables */
}
```

### Layout
Adjust grid layouts and spacing in the respective CSS classes.

### Data Integration
Replace mock data with actual API calls in the component state management.

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance

- Lazy loading for conversation data
- Optimized CSS with minimal repaints
- Efficient state management
- Responsive images and assets

## Future Enhancements

- [ ] Real-time data updates
- [ ] Audio playback integration
- [ ] Export functionality for reports
- [ ] Advanced filtering and search
- [ ] Data visualization charts
- [ ] Offline support