import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../lib/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const telegramWebApp = window.Telegram.WebApp;

      telegramWebApp.BackButton.show();
      const backButtonHandler = () => {
        navigate("/home");
      };

      telegramWebApp.onEvent("backButtonClicked", backButtonHandler);

      // Cleanup function to remove the event listener
      return () => {
        telegramWebApp.offEvent("backButtonClicked", backButtonHandler);
        telegramWebApp.BackButton.hide();
      };
    }
  }, []);
  console.log("user", user);

  const getInitials = (name: any) => {
    // Get the first letter of the username
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return "";
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200 relative flex flex-col h-screen overflow-hidden">
      {/* Profile Section - Fixed at Top */}
      <div className="p-6 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback>
                {user?.username ? user?.username[0] : ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mx-4">
        <Button
          onClick={() => navigate("/myProfile/messages")}
          className="text-lg font-semibold text-white w-[50%] rounded-r-none border-none border-l-0"
        >
          Messages
        </Button>
        <Button
          onClick={() => navigate("/myProfile/friends")}
          className="text-lg font-semibold text-white w-[50%] rounded-l-none border-none border-r-0"
        >
          Friends
        </Button>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MyProfile;
