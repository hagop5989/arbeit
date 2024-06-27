import { JobsRegister } from "../page/jobs/JobsRegister.jsx";
import { JobsList } from "../page/jobs/JobsList.jsx";
import { ResumeRegister } from "../page/resume/ResumeRegister.jsx";
import { ResumeList } from "../page/resume/ResumeList.jsx";
import { ResumeEdit } from "../page/resume/ResumeEdit.jsx";
import { JobsEdit } from "../page/jobs/JobsEdit.jsx";
import { ResumeView } from "../page/resume/ResumeView.jsx";
import { ApplicationList } from "../page/application/ApplicationList.jsx";
import { ApplicationMangeList } from "../page/application/manage/ApplicationMangeList.jsx";
import Test1 from "../page/test)calendar/Test1.jsx";
import VisitHistory from "../component/VisitHistory.jsx";
import JobsView from "../page/jobs/JobsView.jsx";
import ScrapHistory from "../component/ScrapHistory.jsx";
import AlbaReviewList from "../page/review/AlbaReviewList.jsx";
import BossReviewList from "../page/review/BossReviewList.jsx";
import { ApplicationManageView } from "../page/application/manage/ApplicationManageView.jsx";

// list : jobs , view : detail
const bossRoutes = [
  { path: "jobs/register", element: <JobsRegister /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsView /> },
  { path: "jobs/:id/edit", element: <JobsEdit /> },
  { path: "application-manage/list", element: <ApplicationMangeList /> },
  {
    path: "/jobs/:jobsId/application-manage/detail/:albaId",
    element: <ApplicationManageView />,
  },
  { path: "application/list", element: <ApplicationList /> },
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
