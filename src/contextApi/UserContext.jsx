import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const userDataContext = createContext();
const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontEndImage, setFrontEndImage] = useState(null);
  const [backEndImage, setBackEndImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handlecurrenUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponse = async (command) => {
    console.log("Assistant API called with:", command);
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        {command},
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handlecurrenUser();
  }, []);

  const value = {
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
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
};

export default UserContext;
