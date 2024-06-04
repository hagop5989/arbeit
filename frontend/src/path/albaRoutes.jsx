import { AlbaSignup } from "../page/alba/AlbaSignup.jsx";
import { AlbaList } from "../page/alba/AlbaList.jsx";
import { AlbaInfo } from "../page/alba/AlbaInfo.jsx";
import { AlbaEdit } from "../page/alba/AlbaEdit.jsx";

const albaRoutes = [
  { path: "alba/signup", element: <AlbaSignup /> },
  { path: "alba/list", element: <AlbaList /> },
  { path: "alba/:id", element: <AlbaInfo /> },
  { path: "alba/edit/:id", element: <AlbaEdit /> },
];

export default albaRoutes;
