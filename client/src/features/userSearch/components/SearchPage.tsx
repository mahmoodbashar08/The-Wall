import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Card, CardContent } from "../../../components/ui/card";
import { searchUser } from "../api/searchUser";

const UserSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any>([]);

  const navigate = useNavigate();

  // Search handler
  const handleSearch = async () => {
    const response = await searchUser(searchTerm);
    console.log("response.response.users", response.users);
    setUsers(response.users);
  };

  // Telegram WebApp back button setup
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const telegramWebApp = window.Telegram.WebApp;

      telegramWebApp.BackButton.show();
      const backButtonHandler = () => {
        navigate("/home");
      };

      telegramWebApp.onEvent("backButtonClicked", backButtonHandler);

      // Cleanup function
      return () => {
        telegramWebApp.offEvent("backButtonClicked", backButtonHandler);
        telegramWebApp.BackButton.hide();
      };
    }
  }, [navigate]);

  return (
    <div className="p-4">
      {/* Search Input at the Top */}
      <div className="w-full mb-4">
        <div className="flex w-full space-x-2">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {users.map((user: any) => (
          <Card
            key={user.id}
            className="cursor-pointer"
            onClick={() => navigate(`/profile/${user.telegramId}`)}
          >
            <CardContent className="flex items-center space-x-4 p-4">
              <Avatar>
                {user.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user.username} />
                ) : (
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-bold">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">{user.username}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserSearchPage;
