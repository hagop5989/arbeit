import Boss from "./boss/Boss.jsx";
import BossSignup from "./boss/BossSignup.jsx";
import BossLogin from "./boss/BossLogin.jsx";
import BossEdit from "./boss/BossEdit.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Home from "./boss/Home.jsx";

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
      ],
    },
  ]);
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
