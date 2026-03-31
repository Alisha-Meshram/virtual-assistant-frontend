import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../contextApi/UserContext";
import { useNavigate } from "react-router-dom";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognitionRunningRef = useRef(false);

  // 🔊 SPEAK FUNCTION
  const speak = (text) => {
    if (!text) return;

    const speech = new SpeechSynthesisUtterance(text);

    // stop mic before speaking
    if (recognitionRef.current && isRecognitionRunningRef.current) {
      recognitionRef.current.stop();
      isRecognitionRunningRef.current = false;
    }

    isSpeakingRef.current = true;

    speech.onend = () => {
      isSpeakingRef.current = false;
      setTimeout(startRecognition, 500);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // 🎤 START MIC
  const startRecognition = () => {
    const recognition = recognitionRef.current;

    if (
      recognition &&
      !isRecognitionRunningRef.current &&
      !isSpeakingRef.current
    ) {
      try {
        console.log("🎤 Starting mic...");
        recognition.start();
        isRecognitionRunningRef.current = true;
      } catch (err) {
        console.log(err);
      }
    }
  };

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await axios.get(`${serverUrl}/api/v1/logout`, {
      withCredentials: true,
    });
    setUserData(null);
    navigate("/login");
  };

  // 👋 GREETING
  useEffect(() => {
    if (userData?.assistantName) {
      speak(`Hello! What can I do for you?`);
    }
  }, [userData]);

  // 🧠 SETUP SPEECH RECOGNITION
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("🎤 Mic started");
      setListening(true);
      isRecognitionRunningRef.current = true;
    };

    recognition.onend = () => {
      console.log("🛑 Mic ended");
      setListening(false);
      isRecognitionRunningRef.current = false;

      if (!isSpeakingRef.current) {
        setTimeout(startRecognition, 800);
      }
    };

    recognition.onerror = (e) => {
      console.log("❌ Mic error:", e.error);
      setListening(false);
      isRecognitionRunningRef.current = false;
    };

    // 🔥 MAIN LOGIC (NO WAKE WORD)
    recognition.onresult = async (e) => {
      console.log("🎤 RESULT TRIGGERED");

      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      console.log("🗣️ You said:", transcript);

      if (!transcript) return;

      // STOP COMMAND
      if (transcript.toLowerCase().includes("stop")) {
        recognition.stop();
        speak("Stopping listening");
        return;
      }

      setUserText(transcript);
      setAiText("");

      try {
        const data = await getGeminiResponse(transcript);

        console.log("🤖 AI response:", data);

        if (!data) return;

        setAiText(data.response);
        speak(data.response);
      } catch (err) {
        console.log("❌ Error:", err);
      }

      setUserText("");
    };

    return () => {
      recognition.stop();
    };
  }, [userData]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      
      <img
        src={userData?.assistantImage}
        className="w-32 rounded-xl"
        alt="assistant"
      />

      <h2 className="text-white text-xl">
        AI Assistant
      </h2>

      <img src={aiText ? aiImg : userImg} className="w-32" />

      <h1 className="text-white text-center text-lg px-4">
        {userText || aiText || (listening ? "Listening..." : "Click start")}
      </h1>

      {/* 🎤 START BUTTON */}
      <button
        onClick={async () => {
          try {
            console.log("Requesting mic permission...");
            await navigator.mediaDevices.getUserMedia({ audio: true });
            startRecognition();
          } catch (err) {
            alert("Please allow microphone access");
          }
        }}
        className="bg-green-500 px-6 py-2 rounded text-white"
      >
        {listening ? "Listening..." : "Start Listening 🎤"}
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded text-white"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;