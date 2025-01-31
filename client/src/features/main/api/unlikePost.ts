import { axios } from "../../../lib/axios";

// Function to get all items
export const unlikePost = async (postId: any) => {
  try {
    const response = await axios.delete(`likes/${postId}`); // Make a GET request to the /items endpoint

    return response; // Return the data from the response
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};
