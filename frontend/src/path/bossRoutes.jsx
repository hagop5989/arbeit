import BossSignup from "../page/boss/BossSignup.jsx";
import BossLogin from "../page/boss/BossLogin.jsx";
import BossEdit from "../page/boss/BossEdit.jsx";
import { JobsCreate } from "../page/posts/JobsCreate.jsx";
import { JobsList } from "../page/posts/JobsList.jsx";
import JobsDetail from "../page/posts/JobsDetail.jsx";

// list : jobs , view : detail
const bossRoutes = [
  { path: "boss/signup", element: <BossSignup /> },
  { path: "boss/login", element: <BossLogin /> },
  { path: "boss/edit", element: <BossEdit /> },
  // { path: "boss/jobs", element: <BossJobs /> },
  { path: "jobs/create", element: <JobsCreate /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsDetail /> },
];

export default bossRoutes;
