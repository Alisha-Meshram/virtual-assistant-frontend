import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Customize from "./pages/Customize";
import { userDataContext } from "./contextApi/UserContext";
import Home from "./pages/Home";
import Customize2 from "./pages/Customize2";

const App = () => {
  const {userData, setUserData }= useContext(userDataContext);
  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to={"/customize"} />
          )
        }
      />
      <Route
        path="/register"
        element={!userData ? <Register /> : <Navigate to={"/"} />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/register"} />}
      />
      <Route path="/customize2" element={userData ?<Customize2 /> : <Navigate to={'/register'} />} />
    </Routes>
  );
};

export default App;
