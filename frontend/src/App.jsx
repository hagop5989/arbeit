import BossSignup from "./page/boss/BossSignup.jsx";
import BossLogin from "./page/boss/BossLogin.jsx";
import BossEdit from "./page/boss/BossEdit.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import axios from "axios";
import { BossAlbaPost } from "./page/posts/BossAlbaPost.jsx";
import { BossAlbaPostCreate } from "./page/posts/BossAlbaPostCreate.jsx";
import { BossAlbaPostManage } from "./page/posts/BossAlbaPostManage.jsx"; // axios interceptor 설정
import { AlbaSignup } from "./page/alba/AlbaSignup.jsx";
import { Login } from "./page/Login.jsx";
import { AlbaInfo } from "./page/alba/AlbaInfo.jsx";
import { AlbaEdit } from "./page/alba/AlbaEdit.jsx";
import { AlbaList } from "./page/alba/AlbaList.jsx";
import { StoreList } from "./page/store/StoreList.jsx";
import { StoreRegister } from "./page/store/StoreRegister.jsx";
import { BoardWriter } from "./page/board/BoardWriter.jsx";
import { BoardList } from "./page/board/BoardList.jsx";
import { BoardView } from "./page/board/BoardView.jsx";
import { BoardEdit } from "./page/board/BoardEdit.jsx";
import { LoginIndex } from "./LoginIndex.jsx";

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
        { index: true, element: <LoginIndex /> },
        { path: "bossSignup", element: <BossSignup /> },
        { path: "bossLogin", element: <BossLogin /> },
        { path: "bossEdit", element: <BossEdit /> },
        { path: "bossAlbaPost", element: <BossAlbaPost /> },
        { path: "bossAlbaPostCreate", element: <BossAlbaPostCreate /> },
        { path: "bossAlbaPostManage", element: <BossAlbaPostManage /> },
        { path: "login", element: <Login /> },
        { path: "alba/signup", element: <AlbaSignup /> },
        { path: "alba/list", element: <AlbaList /> },
        { path: "alba/:id", element: <AlbaInfo /> },
        { path: "alba/edit/:id", element: <AlbaEdit /> },
        { path: "testIndex", element: <LoginIndex /> },
        { path: "store/list", element: <StoreList /> },
        { path: "store/add", element: <StoreRegister /> },
        { path: "list", element: <BoardList /> },
        { path: "write", element: <BoardWriter /> },
        { path: "board/:id", element: <BoardView /> },
        { path: "edit/:id", element: <BoardEdit /> },
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
