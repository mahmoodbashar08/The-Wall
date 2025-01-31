import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { MessageCircle, Star, Users } from "lucide-react";
import { useAuth } from "../../../lib/auth";
import { loadSingleUserData } from "../../profile/api/loadSingleUserData";
import { Card, CardContent } from "../../../components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { getInvoiceLink } from "../../main/api/getInvoiceLink";
import { createPost } from "../../main/api/createPots";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";

const MessagesList = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState<any>("");
  const [singleUser, setSingleUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any>([]);
  const { telegramId } = useParams();
  const loadSingleUser = async () => {
    if (user?.telegram_id) {
      const response = await loadSingleUserData(user?.telegram_id);
      setSingleUser(response.user);
      setPosts(response.posts);
    }
  };
  useEffect(() => {
    loadSingleUser();
  });
  const handleFriendInvite = () => {
    window.Telegram.WebApp.openTelegramLink(
      `https://t.me/share/url?url=https://t.me/theWallMiniAppBot?startapp=${user?.telegram_id}&text=What is on the wall`
    );
  };

  const handlePost = async (method: any) => {
    setLoading(true);
    if (!newPost.trim()) return;

    if (method === "stars") {
      // const invoiceLink = await botApi.createInvoiceLink(
      //   "Title", //title
      //   "Some description", //description
      //   "{}", //payload
      //   "", // For Telegram Stars payment this should be empty
      //   "XTR", //currency
      //   [{ amount: 1, label: "Diamond" }] //prices
      // );
      const linkOfInvoice = await getInvoiceLink(user?.telegram_id);
      window.Telegram.WebApp.openInvoice(
        linkOfInvoice.url,
        async (status: string) => {
          console.log("Payment status:", status);
          if (status === "paid") {
            console.log("Payment successful!");
            // Proceed with creating the post
            try {
              const data = {
                content: newPost,
                authorId: user?.telegram_id, // The Telegram ID of the author
                targetUserId: user?.telegram_id,
                isPaid: false,
              };
              const response = await createPost(data);
              if (response.status === 201) {
                console.log("Post created successfully!");
                // window.location.reload();
                loadSingleUser();
              } else {
                console.error("Failed to create post:", response);
              }
            } catch (error) {
              console.error("An error occurred:", error);
            }
          } else if (status === "canceled") {
            console.warn("Payment was canceled by the user.");
          } else {
            console.warn("Payment status:", status);
          }

          setNewPost("");
          setIsModalOpen(false);
        }
      );

      // window.Telegram.WebApp.openTelegramLink(
      //   "https://t.me/share/url?url=https://t.me/theWallMiniAppBot?startapp=1&text=What is on the wall"
      // );
      // if (userStars < postCost) {
      //   alert("Not enough stars!");
      //   return;
      // }
      // setUserStars((prev) => prev - postCost);
    } else if (method === "friends") {
      const data = {
        content: newPost,
        authorId: user?.telegram_id, // The Telegram ID of the author
        targetUserId: user?.telegram_id,
        isPaid: false,
      };
      try {
        const response = await createPost(data);

        if (response.status === 201) {
          // Assuming `createPost` returns a Response object
          // window.location.reload(); // Reload the page if the response is ok
          loadSingleUser();
        } else {
          console.error("Failed to create post:", response);
          // Optionally, handle errors or show an error message to the user
        }
      } catch (error) {
        console.error("An error occurred while creating the post:", error);
        // Handle any network or unexpected errors
      }
      setNewPost("");
      setIsModalOpen(false);
    }
    setLoading(false);
    // const post = {
    //   id: posts.length + 1,
    //   user: {
    //     name: "Current User",
    //     avatar: null,
    //   },
    //   content: newPost,
    //   timestamp: "Just now",
    //   likes: 0,
    //   liked: false,
    // };

    // setPosts([post, ...posts]);
    // setNewPost("");
    // setIsModalOpen(false);
    // setSelectedFriends([]);
  };
  return (
    <div>
      <div className="p-4 border-b">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" onClick={() => setIsModalOpen(true)}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        <div className="space-y-4">
          {posts.map((post: any) => (
            <Card key={post.id}>
              <CardContent className="">
                <div className="items-start cursor-pointer">
                  <div className="flex items-center justify-between w-full">
                    <div className="">
                      <Avatar>
                        <AvatarImage src={post.user.profileImage} />
                        <AvatarFallback>
                          {post.user?.username[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-medium pl-2">{post.user.username}</h3>
                    <div className="flex flex-col items-center justify-between">
                      <div className="text-sm text-gray-500 flex items-center justify-center text-center">
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="mt-2">{post.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose How to Post</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="stars" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stars">
                <Star className="w-4 h-4 mr-2" />
                Use Stars
              </TabsTrigger>
              <TabsTrigger value="friends">
                <Users className="w-4 h-4 mr-2" />
                Invite Friends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stars" className="space-y-4">
              <Button
                className="w-full"
                onClick={() => handlePost("stars")}
                disabled={loading}
              >
                Post with Stars
              </Button>
            </TabsContent>

            <TabsContent value="friends" className="space-y-4">
              <div className="space-y-2">
                {" "}
                <div className="font-bold w-full flex justify-center my-4">
                  Invite 5 friends to get 1 post
                </div>
                <p>
                  Total Invites: <strong>{user?.referralTotalCount}</strong>
                </p>
                <p>
                  Unused Invites: <strong>{user?.referralPostCount}</strong>
                </p>
              </div>
              <Button className="w-full" onClick={() => handlePost("friends")}>
                Post Using Invites
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleFriendInvite()}
              >
                Invite More Friends
              </Button>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesList;
