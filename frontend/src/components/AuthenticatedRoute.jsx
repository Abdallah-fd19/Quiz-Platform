import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : children ;
};

export default AuthenticatedRoute;
