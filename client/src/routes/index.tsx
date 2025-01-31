import { useState, useEffect } from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import { Loading } from "../components/elements/loading";
import { useAuth } from "../lib/auth";
import { publicRoutes } from "./public";
import { protectedRouters } from "./protected";

export const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const [loadingDelay, setLoadingDelay] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingDelay(false); // After 2 seconds, stop showing loading
    }, 1000); // 2 seconds delay
    // Clear timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  let routes: RouteObject[] = [];

  if (!isLoading && !loadingDelay) {
    if (user) {
      routes = protectedRouters;
    } else {
      routes = publicRoutes;
    }
    // routes = protectedRouters;
    // switch (user?.rule) {
    //   case "user":
    //     routes = protectedRouters;
    //     break;
    //   default:
    //     routes = publicRoutes;
    // }
  }

  const commonRoutes = [{ path: "*", element: <Loading /> }];
  const element = useRoutes([...routes, ...commonRoutes]);

  // Show Loading for 2 seconds before transitioning to routes
  if (loadingDelay) {
    return (
      <div className="h-screen">
        <Loading size="80" />
      </div>
    );
  }

  return <>{element}</>;
};
