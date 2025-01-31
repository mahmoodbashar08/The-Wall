import storage from "../utils/storage";
import { getUser, AuthUser } from "../features/auth";

export async function loadUser() {
  // Check if Telegram WebApp is available
  if (window.Telegram && window.Telegram.WebApp) {
    const initData = window.Telegram.WebApp.initData; // Retrieve initData from window.Telegram

    if (initData) {
      try {
        const response: any = await getUser();
        if (response.user) {
          const userData: AuthUser = {
            id: response.user.id,
            telegram_id: response.user.telegramId,
            rule: "user",
            profileImage: response.user.profileImage,
            phone_number: response.user.phone_number,
            first_name: response.user.firstName,
            last_name: response.user.lastName,
            username: response.user.username,
            referralPostCount: response.user.referralPostCount,
            referralTotalCount: response.user.referralTotalCount,
          };

          return userData;
        }
        return null;
      } catch (error) {
        console.error("Error loading user:", error);
        return null;
      }
    }
  } else {
    console.warn("Telegram WebApp is not available.");
  }
  return null;
}
