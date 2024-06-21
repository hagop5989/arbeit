import { BoardList } from "../page/board/BoardList.jsx";
import { BoardWrite } from "../page/board/BoardWrite.jsx";
import { BoardView } from "../page/board/BoardView.jsx";
import { BoardEdit } from "../page/board/BoardEdit.jsx";
import { CommentList } from "../page/comment/CommentList.jsx";
import { CommentWrite } from "../page/comment/CommentWrite.jsx";
import FAQ from "../page/board/FAQ.jsx";

const boardRoutes = [
  { path: "board/list", element: <BoardList /> },
  { path: "board/write", element: <BoardWrite /> },
  { path: "board/:id", element: <BoardView /> },
  { path: "board/:id/edit", element: <BoardEdit /> },
  { path: "comment/list", element: <CommentList /> },
  { path: "comment/writer", element: <CommentWrite /> },
  { path: "faq", element: <FAQ /> },
];

export default boardRoutes;
