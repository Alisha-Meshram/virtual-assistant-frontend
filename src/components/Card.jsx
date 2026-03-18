import React, { useContext } from "react";
import { userDataContext } from "../contextApi/UserContext";

const Card = ({ image }) => {
  const {
    serverUrl,
    userData,
    setUserData,
    frontEndImage,
    setFrontEndImage,
    backEndImage,
    setBackEndImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  return (
    <div
      className={`w-[70px] h-[140px]  lg:w-[150px] lg:h-[250px] border border-2 
      border-[#0000ff4d] rounded-2xl bg-[#030326] overflow-hidden hover:shadow-2xl
       hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage===image?'border-4 border-white':null}`}
      onClick={() => {setSelectedImage(image)
      setBackEndImage(null)
      setFrontEndImage(null)}}
    >
      <img src={image} className="h-full object-cover" />
    </div>
  );
};

export default Card;
