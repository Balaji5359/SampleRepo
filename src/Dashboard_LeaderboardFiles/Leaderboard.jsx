import { useState } from "react";
import {
    User,
    Settings,
    BarChart3,
    Award,
    TrendingUp,
    TrendingDown,
    Share2,
    Download,
    Calendar,
    Users,
    Target
} from "lucide-react";
import "./dashboard.css";

function Leaderboard() {
    const [activeTab, setActiveTab] = useState('monthly');
    const [activeScope, setActiveScope] = useState('global');

    // Mock data for leaderboard
    const leaderboardData = [
        {
            rank: 1,
            name: "Sofia Zhang",
            points: 28428,
            streak: "42 days",
            change: "up",
            avatar: "👩‍💼",
            location: "Singapore"
        },
        {
            rank: 2,
            name: "Liam O'Connor",
            points: 27988,
            streak: "38 days",
            change: "same",
            avatar: "👨‍💻",
            location: "Dublin"
        },
        {
            rank: 3,
            name: "Amara N.",
            points: 26516,
            streak: "29 days",
            change: "down",
            avatar: "👩‍🎓",
            location: "Nairobi"
        },
        {
            rank: 4,
            name: "Diego Alvarez",
            points: 24268,
            streak: "31 days",
            change: "up",
            avatar: "👨‍🔬",
            location: "Mexico City"
        }
    ];

    const currentUser = {
        rank: 128,
        name: "You",
        points: 12940,
        streak: "7 days",
        change: "up",
        avatar: "👤",
        location: "Certified"
    };

    const categoryData = [
        {
            skill: "Pronunciation",
            points: 4288,
            trend: "up"
        },
        {
            skill: "Fluency",
            points: 3928,
            trend: "down"
        },
        {
            skill: "Vocabulary",
            points: 2418,
            trend: "up"
        }
    ];

    const friends = [
        { name: "Sofia Zhang", avatar: "👩‍💼", rank: "#1" },
        { name: "Liam O'Connor", avatar: "👨‍💻", rank: "#2" },
        { name: "Amara N.", avatar: "👩‍🎓", rank: "#3" }
    ];

    const renderChangeIcon = (change) => {
        if (change === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (change === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <span className="w-4 h-4 text-gray-400">—</span>;
    };

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

                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <BarChart3 className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">History & Analytics</span>
                            <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-teal-50 text-teal-700 border-l-4 border-teal-500">
                            <Award className="w-5 h-5" />
                            <span>Leaderboard</span>
                            <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-1 rounded-full">Top 15%</span>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Settings className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">Settings</span>
                            <span className="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">1</span>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8"><br></br><br></br><br></br><br></br>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
                            <p className="text-sm text-gray-500 mt-1">You are currently in the Top 15% this month</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Leaderboard */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Tab Navigation */}
                            <div className="flex space-x-1">
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'monthly'
                                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    onClick={() => setActiveTab('monthly')}
                                >
                                    Monthly
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'weekly'
                                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    onClick={() => setActiveTab('weekly')}
                                >
                                    Weekly
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'alltime'
                                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    onClick={() => setActiveTab('alltime')}
                                >
                                    All time
                                </button>
                            </div>

                            {/* Scope Navigation */}
                            <div className="flex space-x-1">
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeScope === 'global'
                                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    onClick={() => setActiveScope('global')}
                                >
                                    Global
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeScope === 'class'
                                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    onClick={() => setActiveScope('class')}
                                >
                                    Class
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeScope === 'friends'
                                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    onClick={() => setActiveScope('friends')}
                                >
                                    Friends
                                </button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <p className="text-sm text-gray-500">Your Rank</p>
                                    <p className="text-3xl font-bold text-gray-800">#128</p>
                                    <p className="text-sm text-gray-500">Out of 1,043 learners</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <p className="text-sm text-gray-500">Points this period</p>
                                    <p className="text-3xl font-bold text-gray-800">12,940</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <p className="text-sm text-gray-500">Next milestone</p>
                                    <p className="text-3xl font-bold text-gray-800">Top 10%</p>
                                    <p className="text-sm text-gray-500">Earn 1,500 more pts</p>
                                </div>
                            </div>

                            {/* Leaderboard Table */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Table Header */}
                                <div className="bg-teal-500 text-white p-4">
                                    <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                                        <div>#</div>
                                        <div>Player</div>
                                        <div>Points</div>
                                        <div>Streak</div>
                                        <div>Change</div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-gray-200">
                                    {leaderboardData.map((player) => (
                                        <div key={player.rank} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="grid grid-cols-5 gap-4 items-center">
                                                <div className="font-semibold text-gray-800">{player.rank}</div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                                                        {player.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{player.name}</p>
                                                        <p className="text-sm text-gray-500">{player.location}</p>
                                                    </div>
                                                </div>
                                                <div className="font-semibold text-gray-800">{player.points.toLocaleString()}</div>
                                                <div>
                                                    <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-sm">
                                                        {player.streak}
                                                    </span>
                                                </div>
                                                <div className="flex justify-center">
                                                    {renderChangeIcon(player.change)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Current User Row */}
                                    <div className="p-4 bg-teal-50 border-2 border-teal-200">
                                        <div className="grid grid-cols-5 gap-4 items-center">
                                            <div className="font-semibold text-gray-800">{currentUser.rank}</div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                                                    {currentUser.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{currentUser.name}</p>
                                                    <p className="text-sm text-gray-500">{currentUser.location}</p>
                                                </div>
                                            </div>
                                            <div className="font-semibold text-gray-800">{currentUser.points.toLocaleString()}</div>
                                            <div>
                                                <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-sm">
                                                    {currentUser.streak}
                                                </span>
                                            </div>
                                            <div className="flex justify-center">
                                                {renderChangeIcon(currentUser.change)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4">
                                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    <span>Share ranking</span>
                                </button>
                                <button className="bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                                    Challenge a friend
                                </button>
                            </div>

                            {/* Category Highlights */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Category Highlights</h3>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span>• Points earned by skill</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 mb-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Skill: All</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Last 30 days</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Download className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Export</span>
                                    </div>
                                </div>

                                {/* Category Header */}
                                <div className="bg-teal-500 text-white p-3 rounded-t-lg">
                                    <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                                        <div>Skill</div>
                                        <div>Points</div>
                                        <div>Rank delta</div>
                                        <div>Share</div>
                                    </div>
                                </div>

                                {/* Category Data */}
                                <div className="divide-y divide-gray-200 border border-gray-200 border-t-0 rounded-b-lg">
                                    {categoryData.map((category, index) => (
                                        <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="grid grid-cols-4 gap-4 items-center">
                                                <div className="font-medium text-gray-800">{category.skill}</div>
                                                <div className="font-semibold text-gray-800">{category.points.toLocaleString()}</div>
                                                <div className="flex justify-center">
                                                    {renderChangeIcon(category.trend)}
                                                </div>
                                                <div className="flex justify-center">
                                                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors">
                                                        <Share2 className="w-4 h-4" />
                                                        <span className="text-sm">Share</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Your Position */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Position</h3>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Top 15% • Global • Month</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-2">#128</p>
                                    <p className="text-sm text-gray-500">1400 pts to reach Top 10%</p>
                                </div>
                            </div>

                            {/* Friends */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Friends</h3>
                                <div className="space-y-3">
                                    {friends.map((friend, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                                                {friend.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm">{friend.name}</p>
                                                <p className="text-xs text-gray-500">{friend.rank}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips</h3>
                                <div className="bg-gray-100 rounded-lg p-4 text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                                    <p className="text-sm text-gray-600">
                                        Maintain your streak and focus on weak areas to climb faster.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;