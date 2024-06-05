import { MemberSignup } from "../page/member/MemberSignup.jsx";
import { MemberList } from "../page/member/MemberList.jsx";
import { MemberInfo } from "../page/member/MemberInfo.jsx";
import { MemberEdit } from "../page/member/MemberEdit.jsx";

const memberRoutes = [
  { path: "signup", element: <MemberSignup /> },
  { path: "member/list", element: <MemberList /> },
  { path: "member/:id", element: <MemberInfo /> },
  { path: "member/edit/:id", element: <MemberEdit /> },
];

export default memberRoutes;
