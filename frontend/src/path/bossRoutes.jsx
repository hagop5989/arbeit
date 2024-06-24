import { JobsRegister } from "../page/jobs/JobsRegister.jsx";
import { JobsList } from "../page/jobs/JobsList.jsx";
import { ResumeRegister } from "../page/resume/ResumeRegister.jsx";
import { ResumeList } from "../page/resume/ResumeList.jsx";
import { ResumeEdit } from "../page/resume/ResumeEdit.jsx";
import { JobsEdit } from "../page/jobs/JobsEdit.jsx";
import { ResumeView } from "../page/resume/ResumeView.jsx";
import { ApplicationWrite } from "../page/application/ApplicationWrite.jsx";
import { ApplicationList } from "../page/application/ApplicationList.jsx";
import { ApplicationView } from "../page/application/ApplicationView.jsx";
import { ManagementList } from "../page/management/ManagementList.jsx";
import { ManagementView } from "../page/management/ManagementView.jsx";
import Test1 from "../page/test)calendar/Test1.jsx";
import VisitHistory from "../component/VisitHistory.jsx";
import JobsView from "../page/jobs/JobsView.jsx";
import ScrapHistory from "../component/ScrapHistory.jsx";
import AlbaReviewList from "../page/review/AlbaReviewList.jsx";
import BossReviewList from "../page/review/BossReviewList.jsx"; // list : jobs , view : detail

// list : jobs , view : detail
const bossRoutes = [
  { path: "jobs/register", element: <JobsRegister /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsView /> },
  { path: "jobs/:id/edit", element: <JobsEdit /> },
  { path: "jobs/:id/management/select", element: <ManagementView /> },
  { path: "jobs/management/list", element: <ManagementList /> },
  { path: "jobs/:id/apply", element: <ApplicationWrite /> },
  { path: "jobs/:id/apply/select", element: <ApplicationView /> },
  { path: "apply/list", element: <ApplicationList /> },
  { path: "resume/register", element: <ResumeRegister /> },
  { path: "resume/list", element: <ResumeList /> },
  { path: "resume/:id", element: <ResumeView /> },
  { path: "resume/:id/edit", element: <ResumeEdit /> },
  { path: "test", element: <Test1 /> },
  { path: "visit-history", element: <VisitHistory /> },
  { path: "scrap-history", element: <ScrapHistory /> },
  { path: "alba-review", element: <AlbaReviewList /> },
  { path: "boss-review", element: <BossReviewList /> },
];

export default bossRoutes;
