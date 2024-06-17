import { JobsRegister } from "../page/posts/JobsRegister.jsx";
import { JobsList } from "../page/posts/JobsList.jsx";
import { ResumeRegister } from "../page/member/ResumeRegister.jsx";
import { ResumeList } from "../page/member/ResumeList.jsx";
import { ResumeEdit } from "../page/member/ResumeEdit.jsx";
import { JobsView } from "../page/posts/JobsView.jsx";
import { ResumeView } from "../page/member/ResumeView.jsx";
import { ApplicationWrite } from "../page/application/applicationWrite.jsx";
import { JobsEdit } from "../page/posts/JobsEdit.jsx"; // list : jobs , view : detail

// list : jobs , view : detail
const bossRoutes = [
  { path: "jobs/create", element: <JobsRegister /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsView /> },
  { path: "jobs/:id/edit", element: <JobsEdit /> },
  { path: "jobs/:id/apply", element: <ApplicationWrite /> },
  { path: "resume/register", element: <ResumeRegister /> },
  { path: "resume/list", element: <ResumeList /> },
  { path: "resume/:id", element: <ResumeView /> },
  { path: "resume/:id/edit", element: <ResumeEdit /> },
];

export default bossRoutes;
