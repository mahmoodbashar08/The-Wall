import * as React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="h-screen flex justify-end w-full">
        <div className="h-screen bg-color4 flex flex-col relative w-full">
          <div className="flex justify-center items-center flex-col h-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
