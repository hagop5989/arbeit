import { ResumeRegister } from "../page/resume/ResumeRegister.jsx";
import { ResumeList } from "../page/resume/ResumeList.jsx";
import { ResumeView } from "../page/resume/ResumeView.jsx";
import { ResumeEdit } from "../page/resume/ResumeEdit.jsx";
import { ApplicationList } from "../page/application/ApplicationList.jsx";
import VisitHistory from "../component/VisitHistory.jsx";
import ScrapHistory from "../component/ScrapHistory.jsx";

const albaRoutes = [
  { path: "resume/register", element: <ResumeRegister /> },
  { path: "resume/list", element: <ResumeList /> },
  { path: "resume/:id", element: <ResumeView /> },
  { path: "resume/:id/edit", element: <ResumeEdit /> },
  { path: "application/list", element: <ApplicationList /> },

  { path: "visit-history", element: <VisitHistory /> },
  { path: "scrap-history", element: <ScrapHistory /> },
];

export default albaRoutes;
