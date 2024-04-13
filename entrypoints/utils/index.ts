import axios from "axios";
import { SERVICE_URL } from "../constants";

export interface Note {
  title?: string;
  session_id?: string;
  url?: string;
  content?: string;
  note?: string;
  folder_id?: string;
  extra_metadata?: object;
  note_type?: string;
}

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


export const sendNote = async (accessToken: string, note: Note) => {
  try {
    const response = await axios.post(`${SERVICE_URL}/v2/save/note`, note, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.log("Unable to save note");
  }
}