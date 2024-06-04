import BossSignup from "../page/boss/BossSignup.jsx";
import BossLogin from "../page/boss/BossLogin.jsx";
import BossEdit from "../page/boss/BossEdit.jsx";
import { BossAlbaPost } from "../page/posts/BossAlbaPost.jsx";
import { BossAlbaPostCreate } from "../page/posts/BossAlbaPostCreate.jsx";
import { BossAlbaPostList } from "../page/posts/BossAlbaPostList.jsx";

const bossRoutes = [
  { path: "bossSignup", element: <BossSignup /> },
  { path: "bossLogin", element: <BossLogin /> },
  { path: "bossEdit", element: <BossEdit /> },
  { path: "bossAlbaPost", element: <BossAlbaPost /> },
  { path: "bossAlbaPostCreate", element: <BossAlbaPostCreate /> },
  { path: "bossAlbaPostList", element: <BossAlbaPostList /> },
];

export default bossRoutes;
