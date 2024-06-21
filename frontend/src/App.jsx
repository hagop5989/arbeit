import { ChakraProvider } from "@chakra-ui/react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Home from "./page/Home.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import axios from "axios";
import { Login } from "./page/Login.jsx";
import memberRoutes from "./path/memberRoutes.jsx";
import bossRoutes from "./path/bossRoutes.jsx";
import storeRoutes from "./path/storeRoutes.jsx";
import boardRoutes from "./path/boardRoutes.jsx";
import { MainPage } from "./MainPage.jsx";
import theme from "../index.js";
import { useEffect } from "react";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// url 경로변경(navigate) 마다 최상단으로 이동.
const ScrollToTopComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <ScrollToTopComponent />
          <Home />
        </>
      ),
      children: [
        { index: true, element: <MainPage /> },
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
