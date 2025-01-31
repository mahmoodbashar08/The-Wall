import { axios } from "../../../lib/axios";
import { User } from "../types/getUserType"; // adjust the import path as necessary

export const getUser = async (): Promise<User | null> => {
  try {
    // Get the startParam from the Telegram WebApp
    let startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
    let profileImage = window.Telegram.WebApp.initDataUnsafe.user.photo_url;
    console.log(
      "window.Telegram.WebApp.initDataUnsafe",
      window.Telegram.WebApp.initDataUnsafe
    );
    // Extract the authorization token (if available)
    const token = window.Telegram.WebApp.initData;

    // Send the authorization token and startParam to the backend
    const response = await axios.post<User>("/users/check", null, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token as a Bearer token
        "x-start-param": startParam, // Pass the startParam if available
        "x-profile-image": profileImage,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
