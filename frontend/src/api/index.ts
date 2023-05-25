import axios, { AxiosResponse } from "axios";
import { UserObject } from "../types";

const backendURL = process.env.REACT_APP_BACKEND_ENDPOINT_URL;

const handleErrorResponse = (error: any) => {
  console.error(`An error occurred: ${error}`);
  return false;
};

// API Calls
export const addUser = async (user: UserObject) => {
  if (!user || typeof user !== "object") {
    console.log("Invalid user object.");
    return false;
  }

  try {
    const response: AxiosResponse = await axios.post(`${backendURL}/create`, user);
    const { status } = response;

    if (status !== 201) {
      console.log(`Failed to add user. Server responded with status: ${status}`);
      return false;
    }

    return true;
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const getUser = async (name: string) => {
  if (!name) {
    console.log("Invalid user name");
    return false;
  }

  try {
    const response: AxiosResponse = await axios.get(`${backendURL}/get/${name}`);
    const { status, data } = response;

    if (status === 200) {
      return data;
    } else {
      console.log(`Failed to fetch user. Server responded with status: ${status}`);
    }

    return true;
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response: AxiosResponse = await axios.get(`${backendURL}/get`);
    const { status, data } = response;

    if (status === 200) {
      return data;
    } else {
      console.log(`Failed to fetch users. Server responded with status: ${status}`);
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return false;
  }
};

export const editUser = async (name: string, user: UserObject) => {
  if (!user || !name) {
    console.log("Invalid user object or name");
    return false;
  }

  try {
    const response: AxiosResponse = await axios.put(`${backendURL}/update/${name}`, user);
    const { status } = response;

    if (status !== 201) {
      console.log(`Failed to update user. Server responded with status: ${status}`);
      return false;
    }

    return true;
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const deleteUser = async (name: string) => {
  if (!name) {
    console.log("Invalid user object.");
    return false;
  }

  try {
    const response: AxiosResponse = await axios.delete(`${backendURL}/delete/${name}`);
    const { status } = response;

    if (status !== 201) {
      console.log(`Failed to delete user. Server responded with status: ${status}`);
      return false;
    }

    return true;
  } catch (error) {
    return handleErrorResponse(error);
  }
};
