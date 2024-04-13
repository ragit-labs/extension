import axios from "axios";
import { SERVICE_URL } from "../constants";

export const fetchUser = async (accessToken: string) => {
    try {
      const response = await axios.get(`${SERVICE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Unable to fetch user. Please login again.");
    }
  };

  export const fetchTags = async (accessToken: string) => {
    try {
      const response = await axios.post(`${SERVICE_URL}/all_tags`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
      return response.data;
    } catch (error) {
      console.log("Unable to fetch tags");
    }
  }

  export default {};