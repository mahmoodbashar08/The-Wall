// storage.ts
const storagePrefix = "Bearer";

const storage = {
  getToken: () => {
    try {
      const token = window.Telegram.WebApp.initData;
      return token ? token : null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  clearToken: () => {
    try {
      window.localStorage.removeItem(`${storagePrefix}_token`);
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  },

  setOrders: (orders: any) => {
    try {
      // Make sure we're storing a string
      const ordersString =
        typeof orders === "string" ? orders : JSON.stringify(orders);
      window.localStorage.setItem("userOrders", ordersString);
    } catch (error) {
      console.error("Error setting orders:", error);
    }
  },
  clearOrders: () => {
    try {
      window.localStorage.removeItem("userOrders");
    } catch (error) {
      console.error("Error clearing user info:", error);
    }
  },
  getOrders: () => {
    try {
      const orders = window.localStorage.getItem("userOrders");
      return orders ? JSON.parse(orders) : {};
    } catch (error) {
      console.error("Error getting orders:", error);
      return {};
    }
  },

  setUserInfo: (userInfo: any) => {
    try {
      const userInfoString = JSON.stringify(userInfo);
      window.localStorage.setItem("userInfo", userInfoString);
    } catch (error) {
      console.error("Error setting user info:", error);
    }
  },

  getUserInfo: () => {
    try {
      const userInfo = window.localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },

  clearUserInfo: () => {
    try {
      window.localStorage.removeItem("userInfo");
    } catch (error) {
      console.error("Error clearing user info:", error);
    }
  },
};

export default storage;
