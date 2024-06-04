import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./page/Home.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BoardWriter } from "./page/board/BoardWriter.jsx";
import { BoardList } from "./page/board/BoardList.jsx";
import { BoardView } from "./page/board/BoardView.jsx";
import { BoardEdit } from "./page/board/BoardEdit.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <div>홈 화면</div>,
      },
      { path: "board/list", component: <BoardList /> },
      { path: "write", element: <BoardWriter /> },
      { path: "board/:id", element: <BoardView /> },
      { path: "edit/:id", element: <BoardEdit /> },
    ],
  },
]);

function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
