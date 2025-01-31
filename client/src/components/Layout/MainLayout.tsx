import React from "react";

type MainLayoutProps = {
  children: React.ReactNode;
};
// In the MainLayout component:
export const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="">{children}</div>;
};
