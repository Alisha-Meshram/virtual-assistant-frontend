import React, { useContext, useState } from "react";
import { userDataContext } from "../contextApi/UserContext";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { userData, backEndImage, selectedImage, serverUrl,setUserData } =
    useContext(userDataContext);
    const navigate=useNavigate()
    const[loading,setLoading]=useState(false)
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const handleUpdate=async()=>{
    setLoading(true)
try {
    let formData=new FormData()
    formData.append("assistantName",assistantName)
if(backEndImage){
    formData.append("assistantImage",backEndImage)
}else{
    formData.append("imageUrl",selectedImage)
}

    const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
    setLoading(false)
    console.log(result.data)
    setUserData(result.data)
  navigate('/')
} catch (error) {
  setLoading(false)
    console.log(error)

}
  }
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col relative">
    <FaArrowLeftLong className="w-[25px] absolute text-[white] h-[25px] top-[30px] left-[30px] cursor-pointer" onClick={()=>{navigate('/customize')}} />
      <h1 className="text-white text-center text-[30px] mb-[30px]">
        Select Your <span className="text-blue-200">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="Eg. Nova"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
        required
        className="text-white text-[18px] placeholder-gray-300 max-w-[600px] w-full h-[60px] outline-none bg-transparent border-2 border-white px-[20px] py-[10px] rounded-full mx-[20px]  "
      />
      {assistantName && (
        <button className=" mt-[20px] min-w-[300px] h-[60px] text-black bg-white rounded-full text-[19px] font-semibold cursor-pointer" disabled={loading} onClick={()=>handleUpdate()}>
         {!loading? "Finally Create Your Assistant":"loading..."}
        </button>
      )}
    </div>
  );
};

export default Customize2;
