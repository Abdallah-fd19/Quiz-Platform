import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import CreateQuiz from './pages/CreateQuiz';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import PixelTrail from './components/PixelTrail.jsx';


const App = () => {
  return (
  <AuthProvider>
    <Router>
      <div className="relative w-full min-h-screen">      
        <div className="fixed inset-0 w-screen h-screen">
          <PixelTrail
            gridSize={50}
            trailSize={0.1}
            maxAge={250}
            interpolate={5}
            color="#00d4ff"
            gooeyFilter={{ id: 'custom-goo-filter', strength: 1 }}
          />
        </div>

        {/* App content */}        
          <NavBar />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/quiz/:id"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:id/results"
                element={
                  <ProtectedRoute>
                    <QuizResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/generate"
                element={
                  <ProtectedRoute>
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
      </div>
    </Router>
  </AuthProvider>
);
};

export default App;
