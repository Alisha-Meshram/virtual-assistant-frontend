import React, { useContext, useState } from "react";
import bg from "../assets/Bg-img.jpg";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../contextApi/UserContext";
const Register = () => {
    const [showPassword,setShowPassword]=useState(false)
    const{serverUrl,userData, setUserData}=useContext(userDataContext)
    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[err,setErr]=useState("")
    const[loading,setLoading]=useState(false)
    const navigate=useNavigate()

   async function register(e){
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      const res=await axios.post(`${serverUrl}/api/v1/register`,{name,email,password},{withCredentials:true})
      console.log(res.data)
      setUserData(res.data)
      setLoading(false)
      navigate('/customize')
    } catch (error) {
      console.log(error)
      setUserData(null)
      setErr(error.response.data.message)
      setLoading(false)
    }
      
    }
  return (
    <div
      className="h-[100vh] w-full bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form onSubmit={register} className="w-[90%] h-[500px] max-w-[500px] flex flex-col justify-center items-center shadow-lg shadow-black backdrop-blur bg-[#00000062] gap-[20px] mb-[20px] px-[20px]">
        <h1 className="text-white text-[30px] font-semibold">
          Register to
          <span className="text-blue-400">Virtual AI Assistant</span>
        </h1>
        <input
          type="text"
          placeholder="Enter Your Name" value={name} onChange={(e)=>{setName(e.target.value)}}
          required
          className="text-white text-[18px] placeholder-gray-300  w-full h-[60px] outline-none bg-transparent border-2 border-white px-[20px] py-[10px] rounded-full mx-[20px]  "
        />
        <input
          type="email"
          placeholder="Enter Your Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}
          required
          className="text-white text-[18px] placeholder-gray-300  w-full h-[60px] outline-none bg-transparent border-2 border-white px-[20px] py-[10px] rounded-full mx-[20px]  "
        />
        <div  className="relative w-full h-[60px] outline-none bg-transparent border-2 border-white rounded-full mx-[20px] ">
          <input
          type={showPassword?'text':'password'}
            placeholder="Enter Your Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}
            required
            className="text-white text-[18px] outline-none placeholder-gray-300  w-full h-full   px-[20px] py-[10px]  "
          />
          {!showPassword && <IoEye className="absolute text-white w-[25px] h-[25px] top-[20px] right-[18px]" onClick={()=>{setShowPassword(true)}} />}
          {showPassword && <IoEyeOff className="absolute text-white w-[25px] h-[25px] top-[20px] right-[18px]" onClick={()=>{setShowPassword(false)}} />}
        </div>
        {err.length>0 && <p className="text-red-500">*{err}</p>}
        <button type="submit" className="min-w-[150px] h-[60px] text-black bg-white rounded-full text-[19px] font-semibold" onClick={()=>{navigate('/login')}} disabled={loading}>{loading?"loading...":"Sign Up"}</button>
        <p className="text-[white] text-[18px] cursor-pointer">Already you have account ? <span className="text-blue-400" onClick={()=>{navigate('/login')}}>Sign In</span></p>
      </form>
    </div>
  );
};

export default Register;
