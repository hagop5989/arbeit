import { BoardList } from "../page/board/BoardList.jsx";
import { BoardWrite } from "../page/board/BoardWrite.jsx";
import { BoardView } from "../page/board/BoardView.jsx";
import { BoardEdit } from "../page/board/BoardEdit.jsx";

const boardRoutes = [
  { path: "board/list", element: <BoardList /> },
  { path: "board/write", element: <BoardWrite /> },
  { path: "board/:id", element: <BoardView /> },
  { path: "board/edit/:id", element: <BoardEdit /> },
];

export default boardRoutes;
