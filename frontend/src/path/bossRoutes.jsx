import BossSignup from "../page/boss/BossSignup.jsx";
import BossLogin from "../page/boss/BossLogin.jsx";
import BossEdit from "../page/boss/BossEdit.jsx";
import { BossAlbaPost } from "../page/posts/BossAlbaPost.jsx";
import { BossAlbaPostCreate } from "../page/posts/BossAlbaPostCreate.jsx";
import { BossAlbaPostList } from "../page/posts/BossAlbaPostList.jsx";
import BossAlbaPostView from "../page/posts/BossAlbaPostView.jsx";

const bossRoutes = [
  { path: "boss/signup", element: <BossSignup /> },
  { path: "boss/login", element: <BossLogin /> },
  { path: "boss/edit", element: <BossEdit /> },
  { path: "boss/albaPost", element: <BossAlbaPost /> },
  { path: "boss/albaPost/create", element: <BossAlbaPostCreate /> },
  { path: "boss/albaPost/list", element: <BossAlbaPostList /> },
  { path: "boss/albaPost/:id", element: <BossAlbaPostView /> },
];

export default bossRoutes;
