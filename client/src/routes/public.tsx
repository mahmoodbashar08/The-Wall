import { Navigate } from "react-router-dom";
import React from "react";
import { AuthRoutes } from "../features/auth/routes";

export const publicRoutes = [
  {
    path: "/auth/*",
    element: <AuthRoutes />,
  },
  {
    path: "*",
    element: <Navigate to="/auth" />,
  },
];
