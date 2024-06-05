import { BoardList } from "../page/board/BoardList.jsx";
import { BoardWrite } from "../page/board/BoardWrite.jsx";
import { BoardView } from "../page/board/BoardView.jsx";
import { BoardEdit } from "../page/board/BoardEdit.jsx";

const boardRoutes = [
  { path: "list", element: <BoardList /> },
  { path: "write", element: <BoardWrite /> },
  { path: "board/:id", element: <BoardView /> },
  { path: "edit/:id", element: <BoardEdit /> },
];

export default boardRoutes;
