import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ allowedRole }) => {
  const authToken = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  const isAllowed = Array.isArray(allowedRole)
    ? allowedRole.includes(userRole)
    : userRole === allowedRole;

  if (authToken && isAllowed) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
