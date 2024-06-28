import { MemberSignup } from "../page/member/MemberSignup.jsx";
import { MemberList } from "../page/member/MemberList.jsx";
import { MemberInfo } from "../page/member/MemberInfo.jsx";
import { MemberEdit } from "../page/member/MemberEdit.jsx";
import { FindMember } from "../page/member/FindMember.jsx";
import { Login } from "../page/member/Login.jsx";

/**
 * 회원 통합 기능
 */
const memberRoutes = [
  { path: "login", element: <Login /> },
  { path: "signup", element: <MemberSignup /> },
  { path: "member/list", element: <MemberList /> },
  { path: "member/:id", element: <MemberInfo /> },
  { path: "member/:id/edit", element: <MemberEdit /> },
  { path: "find-member", element: <FindMember /> },
];

export default memberRoutes;
