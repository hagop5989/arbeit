import BossSignup from "../page/boss/BossSignup.jsx";
import BossLogin from "../page/boss/BossLogin.jsx";
import BossEdit from "../page/boss/BossEdit.jsx";
import { JobsCreate } from "../page/posts/JobsCreate.jsx";
import { JobsList } from "../page/posts/JobsList.jsx";
import JobsView from "../page/posts/JobsView.jsx";
import { ResumeWrite } from "../page/member/ResumeWrite.jsx";
import { ResumeList } from "../page/member/ResumeList.jsx";
import ResumeView from "../page/member/ResumeView.jsx"; // list : jobs , view : detail

// list : jobs , view : detail
const bossRoutes = [
  { path: "boss/signup", element: <BossSignup /> },
  { path: "boss/login", element: <BossLogin /> },
  { path: "boss/edit", element: <BossEdit /> },
  { path: "jobs/create", element: <JobsCreate /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsView /> },
  { path: "member/resume/write", element: <ResumeWrite /> },
  { path: "member/resume/list", element: <ResumeList /> },
  { path: "member/resume/:id", element: <ResumeView /> },
];

export default bossRoutes;
