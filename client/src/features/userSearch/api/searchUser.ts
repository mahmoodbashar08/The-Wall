import { axios } from "../../../lib/axios";

// Function to get all items
export const searchUser = async (userName: string) => {
  try {
    const response = await axios.get(`/users/username/${userName}`); // Make a GET request to the /items endpoint
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};
