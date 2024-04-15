import axios from "axios";
import { SERVICE_URL } from "../constants";
import { Note } from "../types";


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
    const response = await axios.post(
      `${SERVICE_URL}/all_tags`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log("Unable to fetch tags");
  }
};

export const sendNote = async (accessToken: string, note: Note) => {
  try {
    const response = await axios.post(`${SERVICE_URL}/v2/notes/save`, note, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Unable to save note");
  }
};

export const fetchFolders = async (accessToken: string) => {
  try {
    const response = await axios.post(`${SERVICE_URL}/v2/folders/get`, {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Unable to fetch folders", error);
  }
};


export default {};