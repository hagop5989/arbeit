import Boss from "./boss/Boss.jsx";
import BossSignup from "./boss/BossSignup.jsx";
import BossLogin from "./boss/BossLogin.jsx";
import BossEdit from "./boss/BossEdit.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Home from "./boss/Home.jsx";
import { LoginProvider } from "./boss/LoginProvider.jsx";
import axios from "axios";
import { BossAlbaPost } from "./BossAlbaPost.jsx";
import { BossAlbaPostCreate } from "./BossAlbaPostCreate.jsx";
import { BossAlbaPostManage } from "./BossAlbaPostManage.jsx"; // axios interceptor 설정

// axios interceptor 설정
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        { index: true, element: <Boss /> },
        { path: "bossSignup", element: <BossSignup /> },
        { path: "bossLogin", element: <BossLogin /> },
        { path: "bossEdit", element: <BossEdit /> },
        { path: "bossAlbaPost", element: <BossAlbaPost /> },
        { path: "bossAlbaPostCreate", element: <BossAlbaPostCreate /> },
        { path: "bossAlbaPostManage", element: <BossAlbaPostManage /> },
      ],
    },
  ]);
  return (
    <LoginProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
