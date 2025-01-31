import React, { useEffect, useState } from "react";
import { Send, Heart, Users, Star, Link2, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../api/getAllPosts";
import { useAuth } from "../../../lib/auth";
import { getInvoiceLink } from "../api/getInvoiceLink";
import { createPost } from "../api/createPots";
import { formatDate } from "../../../utils/formatDate";
import { likePost } from "../api/likePost";
import { unlikePost } from "../api/unlikePost";

const MainPage = () => {
  const [posts, setPosts] = useState<any>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeLoadingStates, setLikeLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const loadPosts = async () => {
    const response = await getAllPosts();
    console.log("responseresponse", response);

    setPosts(response);
  };
  useEffect(() => {
    loadPosts();
  }, []);
  const handlePost = async (method: any) => {
    setLoading(true);
    if (!newPost.trim()) return;

    if (method === "stars") {
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
                authorId: user?.telegram_id,
                isPaid: true,
              };
              const response = await createPost(data);
              if (response.status === 201) {
                console.log("Post created successfully!");
                // window.location.reload();
                loadPosts();
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
        isPaid: false,
      };

      try {
        const response = await createPost(data);

        if (response.status === 201) {
          // Assuming `createPost` returns a Response object
          // window.location.reload(); // Reload the page if the response is ok
          loadPosts();
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
  const handleUserSearch = () => {
    navigate("/search");
  };

  const handleLike = async (postId: string) => {
    setLikeLoadingStates((prevStates) => ({ ...prevStates, [postId]: true }));

    try {
      // Find the post by ID to check its current like status
      const post = posts.find((post: any) => post.id === postId);

      if (!post) {
        console.error("Post not found");
        return;
      }

      // Determine if this is a like or unlike action
      const isCurrentlyLiked = post.isLiked;

      // Call API to like or unlike based on current status
      let response;
      if (isCurrentlyLiked) {
        // Unlike the post
        response = await unlikePost(postId);
      } else {
        // Like the post
        response = await likePost(postId);
      }

      // Check for a successful response from the API
      if (response.status === 200 || response.status === 201) {
        // Update the post's like status and count in the local state
        setPosts((prevPosts: any[]) => {
          return prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isLiked: !isCurrentlyLiked, // Toggle the like status
                  likeCount: isCurrentlyLiked
                    ? p.likeCount - 1
                    : p.likeCount + 1, // Update like count accordingly
                }
              : p
          );
        });
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error handling like/unlike action:", error);
    } finally {
      setLikeLoadingStates((prevStates) => ({
        ...prevStates,
        [postId]: false,
      }));
    }
  };

  const handleProfile = () => {
    navigate("/myProfile");
  };

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  }, []);
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col relative">
      <Card className="rounded-none">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => handleProfile()}
          >
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUserSearch()}
            className="flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
          </Button>
        </CardHeader>
      </Card>

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-20">
        {posts.map((post: any) => (
          <Card key={post.id}>
            <CardContent className="">
              <div
                className="items-start cursor-pointer"
                onClick={() => {
                  navigate(`/profile/${post.user.telegramId}`);
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src={post.user.profileImage} />
                      <AvatarFallback>{post.user?.username[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium pl-2">{post.user.username}</h3>
                  </div>
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
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={post.isLiked ? "text-red-500" : ""}
                disabled={likeLoadingStates[post.id]}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    post.isLiked ? "fill-current" : ""
                  }`}
                />
                {post.likeCount} likes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-background border-t shadow-lg">
        <div className="px-6 pb-6 pt-2 flex items-center space-x-8">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback>
              {user?.username ? user?.username[0] : ""}
            </AvatarFallback>
          </Avatar>
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

export default MainPage;
