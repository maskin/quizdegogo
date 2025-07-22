import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import QuizListPage from './pages/QuizListPage';
import QuizDetailPage from './pages/QuizDetailPage';
import QuizPlayPage from './pages/QuizPlayPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Hooks
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>QuizDeGogo - Global Learning Platform</title>
        <meta 
          name="description" 
          content="AI-powered quiz platform for global learning. Adaptive quizzes for all life forms." 
        />
        <meta name="keywords" content="quiz, learning, education, AI, adaptive, global" />
        <meta property="og:title" content="QuizDeGogo - Global Learning Platform" />
        <meta property="og:description" content="AI-powered quiz platform for global learning" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        
        <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/quiz/:id" element={<QuizDetailPage />} />
            
            {/* Protected routes */}
            {user && (
              <>
                <Route path="/quiz/:id/play" element={<QuizPlayPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </>
            )}
            
            {/* Fallback route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default App;