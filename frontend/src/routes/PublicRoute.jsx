
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({children}) => {
  const { user, token } = useSelector((state) => state.auth);

  return token || user ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;