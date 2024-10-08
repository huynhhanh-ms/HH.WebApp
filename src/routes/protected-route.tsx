import { Navigate } from "react-router-dom";

import { useApp } from "src/stores/use-app";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  const isLoggedIn = useApp((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    // temporary
    // return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
