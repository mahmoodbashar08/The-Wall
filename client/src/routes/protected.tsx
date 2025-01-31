import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "../components/Layout/MainLayout";
import MainPage from "../features/main/components/MainPage";
import UserProfileWall from "../features/profile/components/UserProfile";
import UserSearchPage from "../features/userSearch/components/SearchPage";
import MyProfile from "../features/MyProfile/components/MyProfile";
import MessagesList from "../features/MyProfile/components/MessagesList";
import FriendsList from "../features/MyProfile/components/FriendsList";

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const protectedRouters = [
  {
    path: "/home",
    element: <App />,
    children: [{ path: "", element: <MainPage /> }],
  },
  {
    path: "/profile",
    element: <App />,
    children: [
      { path: ":telegramId", element: <UserProfileWall /> }, // Match `/profile/:id`
      { path: "", element: <Navigate to="/home" /> }, // Redirect `/profile` to `/home`
    ],
  },
  {
    path: "/search",
    element: <App />,
    children: [{ path: "", element: <UserSearchPage /> }],
  },
  {
    path: "/myProfile",
    element: <App />,
    children: [
      {
        path: "",
        element: <MyProfile />,
        children: [
          { path: "", element: <MessagesList /> }, // Default view
          { path: "messages", element: <MessagesList /> },
          { path: "friends", element: <FriendsList /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/home" />,
  },
];
