import { JobsCreate } from "../page/posts/JobsCreate.jsx";
import { JobsList } from "../page/posts/JobsList.jsx";
import { ResumeWrite } from "../page/member/ResumeWrite.jsx";
import { ResumeList } from "../page/member/ResumeList.jsx";
import { ResumeEdit } from "../page/member/ResumeEdit.jsx";
import { JobsView2 } from "../page/posts/JobsView2.jsx";
import { ResumeView } from "../page/member/ResumeView.jsx"; // list : jobs , view : detail

// list : jobs , view : detail
const bossRoutes = [
  { path: "jobs/create", element: <JobsCreate /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsView2 /> },
  { path: "member/resume/write", element: <ResumeWrite /> },
  { path: "member/resume/list", element: <ResumeList /> },
  { path: "member/resume/:id", element: <ResumeView /> },
  { path: "member/resume/edit", element: <ResumeEdit /> },
];

export default bossRoutes;
