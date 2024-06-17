import { JobsCreate } from "../page/posts/JobsCreate.jsx";
import { JobsList } from "../page/posts/JobsList.jsx";
import { ResumeRegister } from "../page/member/ResumeRegister.jsx";
import { ResumeList } from "../page/member/ResumeList.jsx";
import { ResumeEdit } from "../page/member/ResumeEdit.jsx";
import { JobsView } from "../page/posts/JobsView.jsx";
import { ResumeView } from "../page/member/ResumeView.jsx";
import { ApplicationWrite } from "../page/application/ApplicationWrite.jsx";
import { ApplicationList } from "../page/application/ApplicationList.jsx";
import { ApplicationView } from "../page/application/ApplicationView.jsx";
import { ApplicationEdit } from "../page/application/ApplicationEdit.jsx";
import { ManagementList } from "../page/management/ManagementList.jsx";
import { ManagementView } from "../page/management/ManagementView.jsx";
import Test1 from "../page/test)calendar/Test1.jsx"; // list : jobs , view : detail

// list : jobs , view : detail
const bossRoutes = [
  { path: "jobs/create", element: <JobsCreate /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsView /> },
  { path: "jobs/:id/management/select", element: <ManagementView /> },
  { path: "jobs/management/list", element: <ManagementList /> },
  { path: "jobs/:id/apply", element: <ApplicationWrite /> },
  { path: "jobs/:id/apply/select", element: <ApplicationView /> },
  { path: "jobs/:id/apply/edit", element: <ApplicationEdit /> },
  { path: "jobs/apply/list", element: <ApplicationList /> },
  { path: "resume/register", element: <ResumeRegister /> },
  { path: "resume/list", element: <ResumeList /> },
  { path: "resume/:id", element: <ResumeView /> },
  { path: "resume/:id/edit", element: <ResumeEdit /> },
  { path: "test", element: <Test1 /> },
];

export default bossRoutes;
