import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../lib/auth";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          hi
        </div>
      }>
      <AuthProvider>
        <Router>{children}</Router>
      </AuthProvider>
    </React.Suspense>
  );
};
