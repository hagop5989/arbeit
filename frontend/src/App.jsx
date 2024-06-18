import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import axios from "axios";
import { Login } from "./page/Login.jsx";
import memberRoutes from "./path/memberRoutes.jsx";
import bossRoutes from "./path/bossRoutes.jsx";
import storeRoutes from "./path/storeRoutes.jsx";
import boardRoutes from "./path/boardRoutes.jsx";
import { NavComponent } from "./NavComponent.jsx";
import theme from "../index.js";

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
        { index: true, element: <NavComponent /> },
        ...memberRoutes,
        ...bossRoutes,
        ...storeRoutes,
        ...boardRoutes,
        { path: "login", element: <Login /> },
      ],
    },
  ]);

  return (
    <LoginProvider>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
