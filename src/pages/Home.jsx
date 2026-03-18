import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../contextApi/UserContext";
import { useNavigate } from "react-router-dom";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { LuMenu } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const recognitionRef = useRef(null);
  const[ham,setHam]=useState(false)
  const isRecognitionRunningRef = useRef(false);
  const synth = window.speechSynthesis;
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
      console.log(result.data);
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isRecognitionRunningRef.current) {
      try {
        recognitionRef.current?.start();
        isRecognitionRunningRef.current = true;
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Recognition error", error);
        }
      }
    }
  };
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterence = new SpeechSynthesisUtterance(text);

    isSpeakingRef.current = true;
    utterence.onend = () => {
      isSpeakingRef.current = false;
      startRecognition();
    };
    synth.speak(utterence);
  };

  const handleCommand = (data) => {
    console.log("command recive", data);
    console.log("TYPE:", data?.type);
    if (!data) {
      speak("soory i did't understand that");
      return;
    }
    const { type, userInput, response } = data;

    if (!type) {
      speak(response);
      return;
    }

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_self");
      return;
    }

    if (type === "instagram-open") {
      window.open(`https://www.instagram.com`, "_self");
      return;
    }

    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_self"
      );
      return;
    }

    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_self");
      return;
    }

    if (type === "facebook-open") {
      window.open(`https://www.facebook.com`, "_self");
      return;
    }

    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, "_self");
      return;
    }

    if (type === "get-time") {
      speak(`The time is ${new Date().toLocaleTimeString()}`);
      return;
    }
    if (type === "get-day") {
      speak(
        `Today is ${new Date().toLocaleDateString("en-US", {
          weekday: "long",
        })}`
      );
      return;
    }

    if (type === "get-date") {
      speak(`Today's date is ${new Date().toLocaleDateString()}`);
      return;
    }

    if (type === "get-month") {
      speak(
        `This month is ${new Date().toLocaleDateString("en-US", {
          month: "long",
        })}`
      );
      return;
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;
    const isRecognizingRef = { current: false };

    const safeRecognition = () => {
      if (
        recognitionRef.current &&
        !isRecognitionRunningRef.current &&
        !isSpeakingRef.current
      ) {
        try {
          recognitionRef.current.start();
          isRecognitionRunningRef.current = true;
          console.log("recognition safely started");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("start error", err);
          }
        }
      }
    };
    recognition.onstart = () => {
      console.log("recognition started");
      isRecognizingRef.current = true;
      isRecognitionRunningRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      setAiText("");
      console.log("recognition ended");
      isRecognizingRef.current = false;
      isRecognitionRunningRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };
    recognition.onerror = (event) => {
      console.warn("Recognition Error", event.error);
      isRecognizingRef.current = false;
      isRecognitionRunningRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 10000);
      }
    };
    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard:" + transcript);

      if (
        userData?.assistantName &&
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        // recognition.stop()
        // isRecognizingRef.current=false
        setListening(false);
        let data = await getGeminiResponse(transcript);
        console.log("DATA:", data);

        // ✅ Only parse if it's a string
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch (err) {
            console.error("JSON parse error", err);
            speak("Sorry, I didn't understand.");
            return;
          }
        }

        console.log("assistant response", data);

        if (!data) return;

        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    safeRecognition();
    return () => {
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, [userData]);
  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#010142] flex flex-col lg:flex-row">
  
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 relative overflow-hidden px-4">
  
        {/* Mobile Menu Icon */}
        <LuMenu
          className="lg:hidden w-6 h-6 absolute top-5 right-5 text-white cursor-pointer"
          onClick={() => setHam(true)}
        />
  
        {/* Assistant Image */}
        <div className="w-full max-w-[150px] mt-[1rem] sm:max-w-[320px] md:max-w-[150px] lg:max-w-[200px] aspect-[3/4] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg">
          <img
            src={userData?.assistantImage}
            alt="assistant"
            className="w-full h-full object-cover"
          />
        </div>
  
        <h2 className="text-white text-base sm:text-lg md:text-xl font-semibold text-center">
          I'm {userData?.assistantName}
        </h2>
  
        <div className="flex justify-center items-center">
          {aiText ? (
            <img src={aiImg} alt="ai" className="w-32 sm:w-40 md:w-48" />
          ) : (
            <img src={userImg} alt="user" className="w-32 sm:w-40 md:w-48" />
          )}
        </div>
  
        <h1 className="text-white text-center text-sm sm:text-base md:text-lg lg:text-xl max-w-[90%] break-words">
          {userText ? userText : aiText ? aiText : null}
        </h1>
      </div>
  
      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[260px] bg-[#00000080] backdrop-blur-md
          flex flex-col gap-5 p-5 transition-transform duration-300 z-50
          
          ${ham ? "translate-x-0" : "translate-x-full"}
          
          lg:translate-x-0 lg:static lg:w-[250px] lg:bg-transparent lg:backdrop-blur-none
        `}
      >
        {/* Close button (only mobile) */}
        <RxCross2
          size={25}
          className="text-white cursor-pointer lg:hidden"
          onClick={() => setHam(false)}
        />
  
        <button
          className="w-full h-12 bg-white text-black rounded-full font-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
  
        <button
          className="w-full h-12 bg-white text-black rounded-full font-semibold px-4"
          onClick={() => navigate("/customize")}
        >
          Customize AI
        </button>
  
        <div className="w-full h-[2px] bg-gray-400 lg:hidden"></div>
  
        <h1 className="text-white font-semibold text-lg lg:hidden">History</h1>
  
        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
          {userData.history?.map((his, index) => (
            <span key={index} className="text-white text-sm">
              {his}
            </span>
          ))}
        </div>
      </div>
  
    </div>
  );
};

export default Home;
