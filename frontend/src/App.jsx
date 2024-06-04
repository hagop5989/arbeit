import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AlbaSignup } from "./page/alba/AlbaSignup.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "./page/Home.jsx";
import { Login } from "./page/Login.jsx";
import axios from "axios";
import { LoginProvider } from "./component/LoginProvider.jsx";
import { AlbaInfo } from "./page/alba/AlbaInfo.jsx";
import { AlbaEdit } from "./page/alba/AlbaEdit.jsx";
import { AlbaList } from "./page/alba/AlbaList.jsx";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <div>index 화면</div> },
      { path: "login", element: <Login /> },
      { path: "alba/signup", element: <AlbaSignup /> },
      { path: "alba/list", element: <AlbaList /> },
      { path: "alba/:id", element: <AlbaInfo /> },
      { path: "alba/edit/:id", element: <AlbaEdit /> },
    ],
  },
]);
function App() {
  return (
    <LoginProvider value={null}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
