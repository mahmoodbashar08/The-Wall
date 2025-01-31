import React, { useEffect, useState } from "react";
import { getFriendsList } from "../api/getFriendsList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../../components/elements/loading"; // Import your Loading component
import { useAuth } from "../../../lib/auth";

const FriendsList = () => {
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFriendInvite = () => {
    window.Telegram.WebApp.openTelegramLink(
      `https://t.me/share/url?url=https://t.me/theWallMiniAppBot?startapp=${user?.telegram_id}&text=What is on the wall`
    );
  };

  const handleFriends = async () => {
    try {
      setLoading(true); // Start loading
      const response = await getFriendsList();
      setFriendsList(response.referrals);
    } catch (error) {
      console.error("Failed to fetch friends list:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    handleFriends();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Friends List {friendsList.length > 0 && `(${friendsList.length})`}
          </CardTitle>
          <div className="text-center">
            <button
              onClick={handleFriendInvite}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors"
            >
              Share to a Friend
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loading /> // Show loading while fetching data
        ) : friendsList.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No friends found
          </div>
        ) : (
          <div
            className="space-y-4 max-h-64 overflow-y-auto" // Added scrollable styling
          >
            {friendsList.map((friend: any) => (
              <div
                onClick={() => navigate(`/profile/${friend.telegramId}`)}
                key={friend.id}
                className="flex items-center cursor-pointer justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={friend.profileImage}
                      alt={`${friend.username}'s avatar`}
                    />
                    <AvatarFallback>
                      {friend.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsList;
