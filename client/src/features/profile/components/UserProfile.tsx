import React, { useEffect, useState } from "react";
import { MessageCircle, Send, Star, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { loadSingleUserData } from "../api/loadSingleUserData";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";
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
import { useAuth } from "../../../lib/auth";
import { Loading } from "../../../components/elements/loading";
import { formatDate } from "../../../utils/formatDate";

const UserProfileWall = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { telegramId } = useParams(); // Get the `id` from the URL
  const [newPost, setNewPost] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [singleUser, setSingleUser] = useState<any>(null);
  const { user } = useAuth();
  const [posts, setPosts] = useState<any>([]);
  const loadSingleUser = async () => {
    if (telegramId) {
      const response = await loadSingleUserData(telegramId);
      setSingleUser(response.user);
      setPosts(response.posts);
    }
  };
  useEffect(() => {
    loadSingleUser();
  }, []);
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
      const linkOfInvoice = await getInvoiceLink(user?.id);

      window.Telegram.WebApp.openInvoice(
        linkOfInvoice.url,
        async (status: string) => {
          if (status === "paid") {
            // console.log("Payment successful!");
            // Proceed with creating the post
            try {
              const data = {
                content: newPost,
                authorId: user?.telegram_id, // The Telegram ID of the author
                targetUserId: telegramId,
                isPaid: false,
              };
              const response = await createPost(data);
              if (response.status === 201) {
                // console.log("Post created successfully!");
                // window.location.reload();
                loadSingleUser();
              } else {
                console.error("Failed to create post:", response);
              }
            } catch (error) {
              console.error("An error occurred:", error);
            }
          } else {
            // console.log("its working");
          }
          setIsModalOpen(false);
          setNewPost("");
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
        targetUserId: telegramId,
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
  const handleFriendInvite = () => {
    window.Telegram.WebApp.openTelegramLink(
      `https://t.me/share/url?url=https://t.me/theWallMiniAppBot?startapp=${user?.telegram_id}&text=What is on the wall`
    );
  };
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

  return singleUser && posts ? (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200 relative flex flex-col h-screen overflow-hidden">
      <div className="p-6 space-y-1 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="">
              <Avatar>
                <AvatarImage src={singleUser.profileImage} />
                <AvatarFallback>{singleUser?.username[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {singleUser ? singleUser.username : ""}
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <span>{posts.length}</span>
                <MessageCircle className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Message Input - Floating */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200 relative flex flex-col h-screen overflow-hidden">
        {/* Message Input - Sticky */}
        <div
          className="bg-background sticky top-0 z-10"
          style={{ backgroundColor: "white" }}
        >
          <form className="p-4 flex items-center space-x-6">
            <Input
              placeholder="Share something..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              className="rounded-full"
              onClick={() => setIsModalOpen(true)}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
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
                  <div className="items-start">
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
  ) : (
    <div className="h-screen">
      <Loading size="80" />
    </div>
  );
};

export default UserProfileWall;
