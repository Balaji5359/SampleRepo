import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Basic Components
import Navigation from "./basic_components/Navigation.jsx";
import LoadingSpinner from "./basic_components/LoadingSpinner.jsx";
import ScrollToTop from "./basic_components/ScrollToTop.jsx";

// Landing page components
const LandingPage = lazy(() => import("./LandingPageFiles/LandingPage.jsx"));

// Registration components
const Signup = lazy(() => import("./RegisterFiles/Signup.jsx"));
const Login_Navbar = lazy(() => import("./RegisterFiles/Login_Navbar.jsx"));
const ProfileData = lazy(() => import("./RegisterFiles/ProfileData/ProfileData.jsx"));
const Progress = lazy(() => import("./RegisterFiles/ProfileData/Progress.jsx"));
const ProfileCreation_Survey = lazy(() => import("./RegisterFiles/ProfileCreation/ProfileCreation.jsx"));

// Pratice Components
const Practice = lazy(() => import("./CommunicationPraticeFiles/Practice.jsx"))

// Test Components
const Test = lazy(() => import("./CommunicationTestsFiles/Test.jsx"));
const JAM1 = lazy(() => import("./CommunicationTestsFiles/JAM1.jsx"))
const Pronunciation1 = lazy(() => import("./CommunicationTestsFiles/Pronunciation1.jsx"));
const Listening = lazy(() => import("./CommunicationTestsFiles/Listening.jsx"));
const ImageStory = lazy(() => import("./CommunicationTestsFiles/ImageStory.jsx"));
const TranslateSpeak = lazy(() => import("./CommunicationTestsFiles/TranslateSpeak.jsx"));
const ImageSpeak = lazy(() => import("./CommunicationTestsFiles/ImageSpeak.jsx"));
const SituationSpeak = lazy(() => import("./CommunicationTestsFiles/SituationSpeak.jsx"));

// Student Dashboard and Leaderboard files
const Dashboard = lazy(() => import("./Dashboard_LeaderboardFiles/Dashboard.jsx"));
const JAMDashboard = lazy(() => import("./Dashboard_LeaderboardFiles/JAMDashboard.jsx"));
const PronunciationDashboard = lazy(() => import("./Dashboard_LeaderboardFiles/PronunciationDashboard.jsx"))
const ListeningDashboard = lazy(()=> import("./Dashboard_LeaderboardFiles/ListeningDashboard.jsx"))
const SituationSpeakDashboard = lazy(() => import("./Dashboard_LeaderboardFiles/SituationSpeakDashboard.jsx"));
const ImageSpeakDashboard = lazy(() => import("./Dashboard_LeaderboardFiles/ImageSpeakDashboard.jsx"));
const ImageStoryDashboard = lazy(() => import("./Dashboard_LeaderboardFiles/ImageStoryDashboard.jsx"))
const Leaderboard = lazy(() => import("./Dashboard_LeaderboardFiles/Leaderboard.jsx"))


const MainLayout = ({ children }) => (
  <>
    <main className="main-content">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
  </>
);

// Auth layout is not needed as Login/Signup components handle their own layout
const AuthLayout = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const DashboardLayout = ({ children }) => (
  <>
    {/* <Login_Navbar /> */}
    <main className="dashboard-content">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
  </>
);


const CommunicationPraticeLayout = ({ children }) => (
  <>
    <main className="dashboard-content">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
  </>
);

// Auth guard - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("email");
  return isAuthenticated ? children : <Navigate to="/signup" />;
};

// Reset global styles when navigating between routes
const RouteChangeHandler = () => {
  useEffect(() => {
    // Reset body styles to default
    document.body.style = "";
    document.body.className = "";

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
};

function ErrorBoundary({ children }) {
  // Minimal client-side error boundary
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    if (error) console.error('ErrorBoundary caught:', error);
  }, [error]);
  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Something went wrong rendering the app.</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error && error.stack ? error.stack : error)}</pre>
      </div>
    );
  }
  try {
    return children;
  } catch (e) {
    setError(e);
    return null;
  }
}

function App() {
  return (
    <Router>
      <RouteChangeHandler />
      <ScrollToTop />
      <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <MainLayout>
              <>
                <LandingPage />
              </>
            </MainLayout>
          } />

          {/* Auth routes */}
          <Route path="/signup" element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          } />

          <Route path="/profile-creation-survey" element={
            <AuthLayout>
              <ProfileCreation_Survey />
            </AuthLayout>
          } />

          <Route path="/profiledata" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfileData />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/practice" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Practice />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/test" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Test />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/progress" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Progress />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard/jam" element={
            <ProtectedRoute>
              <JAMDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard/pronunciation" element={
            <ProtectedRoute>
              <PronunciationDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard/listening" element={
            <ProtectedRoute>
              <ListeningDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard/situationspeak" element={
            <ProtectedRoute>
              <SituationSpeakDashboard />
            </ProtectedRoute>
          } />


          <Route path="/student-dashboard/imagespeak" element={
            <ProtectedRoute>
              <ImageSpeakDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard/imagestory" element={
            <ProtectedRoute>
              <ImageStoryDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student-leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />

          {/* Fallback route for non-existent paths */}
          <Route path="/not-found" element={
            <MainLayout>
              <h1>Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </MainLayout>
          } />
          {/* Test Routers */}
          <Route path="/test/jam" element={
            <ProtectedRoute>
              <CommunicationPraticeLayout>
                <JAM1 />
              </CommunicationPraticeLayout>
            </ProtectedRoute>
          } />


          <Route path="/test/pronunciation" element={
            <ProtectedRoute>
              <CommunicationPraticeLayout>
                <Pronunciation1 />
              </CommunicationPraticeLayout>
            </ProtectedRoute>
          } />


          <Route path="/test/image-story" element={
            <ProtectedRoute>
              <CommunicationPraticeLayout>
                <ImageStory />
              </CommunicationPraticeLayout>
            </ProtectedRoute>
          } />

          <Route path = "/test/listening" element={
            <ProtectedRoute>
              <CommunicationPraticeLayout>
                <Listening />
              </CommunicationPraticeLayout>
            </ProtectedRoute>
          }/>

          <Route path="/test/translate-speak" element={
            <ProtectedRoute>
              <CommunicationPraticeLayout>
                <TranslateSpeak />
              </CommunicationPraticeLayout>
            </ProtectedRoute>
          } />

          <Route path="/test/image-speak" element={
            <ProtectedRoute>
              <CommunicationPraticeLayout>
                <ImageSpeak />
              </CommunicationPraticeLayout>
            </ProtectedRoute>
          } />

          <Route path="/test/situation-speak" element={
            <ProtectedRoute>
              <CommunicationPraticeLayout>
                <SituationSpeak />
              </CommunicationPraticeLayout>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;