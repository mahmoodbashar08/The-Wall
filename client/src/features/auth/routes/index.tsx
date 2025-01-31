import { Route, Routes } from "react-router-dom";

import { Login } from "./Login";
import React from "react";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
    </Routes>
  );
};
