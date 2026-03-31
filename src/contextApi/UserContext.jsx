import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [frontEndImage, setFrontEndImage] = useState(null);
  const [backEndImage, setBackEndImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );

      return result.data;
    } catch (error) {
      return {
        type: "general",
        userInput: command,
        response: "Something went wrong",
      };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <userDataContext.Provider
      value={{
        serverUrl,
        userData,
        setUserData,
        frontEndImage,
        setFrontEndImage,
        backEndImage,
        setBackEndImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse,
      }}
    >
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;