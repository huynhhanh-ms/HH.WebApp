import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useApp } from "src/stores/use-app";

import { useRouter } from "./hooks";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  const isLoggedIn = useApp((state) => state.isLoggedIn);
  const { pathname } = useLocation();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/sign-in");
    }
    if ((pathname === "/sign-in" || pathname === "/sign-up") && isLoggedIn === true) {
      router.replace("/admin");
    }

  }, [isLoggedIn, pathname, router]);

  return children;
};

export default ProtectedRoute;
