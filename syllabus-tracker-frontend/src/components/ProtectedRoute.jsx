import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Check if the login token exists in the browser's local storage
  const token = localStorage.getItem('token');

  // 2. If the token exists, show the requested page (using the <Outlet /> component).
  //    Otherwise, redirect the user to the /login page.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;