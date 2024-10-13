import { Navigate, useLocation } from "react-router-dom";

import { useApp } from "src/stores/use-app";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  const isLoggedIn = useApp((state) => state.isLoggedIn);
  const {pathname} = useLocation();

  if (!isLoggedIn) {
    // temporary
    // return <Navigate to="/sign-in" replace />;
  }
  else if (pathname === "/sign-in" || pathname === "/sign-up") {
      return <Navigate to="/admin" replace />;
    }

  return children;
};

export default ProtectedRoute;
