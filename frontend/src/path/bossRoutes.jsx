import { JobsCreate } from "../page/posts/JobsCreate.jsx";
import { JobsList } from "../page/posts/JobsList.jsx";
import { ResumeRegister } from "../page/member/ResumeRegister.jsx";
import { ResumeList } from "../page/member/ResumeList.jsx";
import { ResumeEdit } from "../page/member/ResumeEdit.jsx";
import { JobsView } from "../page/posts/JobsView.jsx";
import { ResumeView } from "../page/member/ResumeView.jsx"; // list : jobs , view : detail

// list : jobs , view : detail
const bossRoutes = [
  { path: "jobs/create", element: <JobsCreate /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsView /> },
  { path: "resume/register", element: <ResumeRegister /> },
  { path: "resume/list", element: <ResumeList /> },
  { path: "resume/:id", element: <ResumeView /> },
  { path: "resume/:id/edit", element: <ResumeEdit /> },
];

export default bossRoutes;
