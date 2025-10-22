import { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Calendar,
    MessageSquare,
    Star,
    Clock,
    Target,
    Award,
    BookOpen,
    Mic,
    Image as ImageIcon,
    Globe,
    FileText,
    Activity,
    User,
    Settings,
    Play,
    Eye,
    RotateCcw,
    Search,
    Download
} from "lucide-react";
import "./dashboard.css";

function Dashboard() {
    const [activeSection, setActiveSection] = useState('history');
    const [activeTab, setActiveTab] = useState('history');

    // Mock data for demonstration
    const historyData = [
        {
            id: 1,
            type: 'JAM: Travel Story',
            date: 'Jan 12, 2025',
            time: '02:30',
            score: 92,
            icon: <Mic className="w-5 h-5" />
        },
        {
            id: 2,
            type: 'Pronunciation',
            date: 'Jan 12, 2025',
            time: '02:30',
            score: 85,
            icon: <Target className="w-5 h-5" />
        },
        {
            id: 3,
            type: 'Image Speak: Market Scene',
            date: 'Jan 11, 2025',
            time: '01:40',
            score: 88,
            icon: <ImageIcon className="w-5 h-5" />
        }
    ];

    const analyticsData = {
        vocabulary: 88,
        pronunciation: 74,
        grammar: 14,
        completed: 126,
        bestDay: { day: 'Tue', score: 92 },
        worstDay: { day: 'Thu', score: 78 },
        dailyAvg: 3.1
    };

    const weeklyData = [
        { week: 'Week', avgScore: 84.6, minutes: 98, attempts: 5 },
        { week: 'Avg %', avgScore: 88, minutes: 85, attempts: 4.2 },
        { week: 'Minutes', avgScore: null, minutes: null, attempts: null },
        { week: 'Attempts', avgScore: null, minutes: null, attempts: null }
    ];

    const monthlyData = [
        { month: 'Month', avgScore: 83, avgPerYear: 86 },
        { month: 'Avg %', avgScore: null, avgPerYear: null },
        { month: 'A per year', avgScore: null, avgPerYear: null }
    ];

    return (
        <div className="dashboard-container">
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-lg">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">L</span>
                            </div>
                            <span className="font-semibold text-gray-800">Lingua</span>
                        </div>
                        <div className="flex space-x-4 text-sm text-gray-600 mt-2">
                            <span>Home</span>
                            <span>Learn</span>
                            <span>Practice</span>
                            <span>Community</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-2">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <User className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">Profile</span>
                            <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                        </div>

                        <div
                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${activeSection === 'history' ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500' : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            onClick={() => setActiveSection('history')}
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span>History & Analytics</span>
                            <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Award className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">Leaderboard</span>
                            <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Settings className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">Settings</span>
                            <span className="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">1</span>
                        </div>

                        <div>
                            {/* Back button navigate to /profiledata */}
                            <button className="btn" onClick={() => window.location.href = "/profiledata"}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s ease',
                                    marginTop: '20px'
                                }}
                            >
                                Back to Profile
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8"><br></br><br></br><br></br><br></br>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">History & Analytics</h1>
                            <div className="flex items-center space-x-2 mt-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Aisha Rahman</p>
                                    <p className="text-xs text-gray-500">Progress visualize</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex space-x-1 mb-8">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'history'
                                ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('history')}
                        >
                            History List
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'analytics'
                                ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            Analytics
                        </button>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            {/* Filter Bar */}
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Last 30 days</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Target className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">All topics</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Activity className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">All modes</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">All scores</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Compare period</span>
                                </div>
                            </div>

                            {/* History List */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="divide-y divide-gray-200">
                                    {historyData.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{item.type}</h4>
                                                        <p className="text-sm text-gray-500">{item.date} • {item.time}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <button className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                                                        <Play className="w-4 h-4" />
                                                        <span>Play</span>
                                                    </button>
                                                    <button className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                                                        <Eye className="w-4 h-4" />
                                                        <span>View Analytics</span>
                                                    </button>
                                                    <button className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                                                        <RotateCcw className="w-4 h-4" />
                                                        <span>Retry</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Score Summary */}
                                <div className="bg-teal-500 text-white p-4 text-center">
                                    <span className="font-medium">864 pts</span>
                                </div>

                                {/* Additional Info */}
                                <div className="p-4 bg-gray-50 text-sm text-gray-600 space-y-1">
                                    <p>Best Attempt</p>
                                    <p>Streak</p>
                                    <p>Focus Area</p>
                                </div>

                                {/* Open Analytics Button */}
                                <div className="p-4 border-t border-gray-200">
                                    <button className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                                        📊 Open Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            {/* Overall Task Grading */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Overall Task Grading</h3>
                                        <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-sm">View more</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Highest skill</p>
                                                <p className="font-semibold">Vocabulary</p>
                                                <p className="text-2xl font-bold text-gray-800">{analyticsData.vocabulary}%</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Lowest skill</p>
                                                <p className="font-semibold">Pronunciation</p>
                                                <p className="text-2xl font-bold text-gray-800">{analyticsData.pronunciation}%</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Score</p>
                                                <p className="font-semibold">Grammar</p>
                                                <p className="text-2xl font-bold text-gray-800">{analyticsData.grammar}</p>
                                                <p className="text-sm text-gray-500">pts</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Completed</p>
                                                <p className="text-2xl font-bold text-gray-800">{analyticsData.completed}</p>
                                                <p className="text-sm text-gray-500">avg</p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            <p>Category weights</p>
                                            <p>Outliers (2 score)</p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs">Beginner</span>
                                            <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs">Intermediate</span>
                                            <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs">Advanced</span>
                                        </div>

                                        <p className="text-xs text-gray-500">
                                            Identifies unusually high/low scores to improve sentence.
                                        </p>
                                    </div>
                                </div>

                                {/* Daily Task Performance */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Task Performance</h3>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Best day</p>
                                            <p className="font-semibold">{analyticsData.bestDay.day} •</p>
                                            <p className="text-2xl font-bold text-gray-800">{analyticsData.bestDay.score}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Worst day</p>
                                            <p className="font-semibold">{analyticsData.worstDay.day} •</p>
                                            <p className="text-2xl font-bold text-gray-800">{analyticsData.worstDay.score}%</p>
                                            <p className="text-sm text-gray-500">avg</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500">Daily average (hrs)</p>
                                        <p className="text-2xl font-bold text-gray-800">{analyticsData.dailyAvg} avg</p>
                                        <p className="text-sm text-gray-500">Task time avg</p>
                                    </div>

                                    <div className="bg-teal-500 text-white p-3 rounded text-center">
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p>Date</p>
                                                <p className="font-semibold">Tasks</p>
                                            </div>
                                            <div>
                                                <p>Avg %</p>
                                            </div>
                                            <div>
                                                <p>Add</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Weekly Progress Report */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">📊 Weekly Progress Report</h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span>Avg Score</span>
                                        <span>Minutes</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    {weeklyData.map((item, index) => (
                                        <div key={index} className="text-center">
                                            <p className="text-sm text-gray-500">{item.week}</p>
                                            {item.avgScore && <p className="text-2xl font-bold text-gray-800">{item.avgScore}%</p>}
                                            {item.minutes && <p className="text-lg text-gray-600">{item.minutes}</p>}
                                            {item.attempts && <p className="text-lg text-gray-600">{item.attempts}</p>}
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-teal-500 text-white p-3 rounded">
                                    <div className="grid grid-cols-4 gap-4 text-sm text-center">
                                        <div>Week</div>
                                        <div>Avg %</div>
                                        <div>Minutes</div>
                                        <div>Attempts</div>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Performance Trend */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">📈 Monthly Performance Trend</h3>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {monthlyData.map((item, index) => (
                                        <div key={index} className="text-center">
                                            <p className="text-sm text-gray-500">{item.month}</p>
                                            {item.avgScore && <p className="text-2xl font-bold text-gray-800">{item.avgScore}%</p>}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-teal-500 text-white p-3 rounded">
                                        <div className="grid grid-cols-3 gap-4 text-sm text-center">
                                            <div>Month</div>
                                            <div>Avg %</div>
                                            <div>A per year</div>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <p>Highlights great</p>
                                        <p>performance and</p>
                                        <p>improvement in declined</p>
                                        <p>Cumulative st</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;