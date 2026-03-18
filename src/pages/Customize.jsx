import React, { useContext, useRef, useState } from "react";
import Card from "../components/Card";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiImageAddFill } from "react-icons/ri";
import assistant1 from "../assets/assistant1.jpg";
import assistant2 from "../assets/assistant2.jpg";
import assistant3 from "../assets/assistant3.jpeg";
import assistant4 from "../assets/assistant4.jpg";
import assistant5 from "../assets/assistant5.jpeg";
import { userDataContext } from "../contextApi/UserContext";
import { useNavigate } from "react-router-dom";
const Customize = () => {
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
  const inputImage = useRef();
  const navigate=useNavigate()

  function handleImage(e) {
    const file = e.target.files[0];
    setBackEndImage(file);
    setFrontEndImage(URL.createObjectURL(file));
  }
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col">
      <h1 className="text-white text-center text-[30px] mb-[30px]">
      <FaArrowLeftLong className="w-[25px] absolute text-[white] h-[25px] top-[30px] left-[30px]" onClick={()=>{navigate('/')}} />
        Select Your <span>Assistant Image</span>
      </h1>
      <div className="w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]">
        <Card image={assistant1} />
        <Card image={assistant2} />
        <Card image={assistant3} />
        <Card image={assistant4} />
        <Card image={assistant5} />

        <div className={`w-[70px] h-[140px]  lg:w-[150px] lg:h-[250px] border border-2 
        border-[#0000ff4d] rounded-2xl bg-[#030326] overflow-hidden hover:shadow-2xl
         hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
         flex justify-center items-center ${selectedImage==='input'?'border-4 border-white':null}`}  onClick={() => {
                inputImage.current.click();
                setSelectedImage("input");
              }}>
         
          {!frontEndImage && (
            <RiImageAddFill
              className="w-[25px] h-[25px] text-white"
             
            />
          )}
          {frontEndImage && (
            <img src={frontEndImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage &&  <button onClick={()=>navigate('/customize2')} className="mt-[20px] min-w-[150px] h-[60px] text-black bg-white rounded-full text-[19px] font-semibold cursor-pointer">
        Next
      </button>}
     
    </div>
  );
};

export default Customize;
