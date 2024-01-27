import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ _protected }: { _protected: number }) => {
  const { auth } = useAuth();
  const isAuthenticated = auth.token !== '';
  const location = useLocation();

  if (_protected === 1 && !isAuthenticated) {
    // this route is protected but the user is not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (_protected === 0 && isAuthenticated) {
    // this route is not protected but the user is logged in
    // so navigate to the home page, these routes are {login, register} which are only for logged out users
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
