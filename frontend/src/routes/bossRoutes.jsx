import { JobsRegister } from "../page/jobs/JobsRegister.jsx";
import { JobsList } from "../page/jobs/JobsList.jsx";
import { JobsEdit } from "../page/jobs/JobsEdit.jsx";
import { ApplicationMangeList } from "../page/management/ApplicationMangeList.jsx";
import JobsView from "../page/jobs/JobsView.jsx";
import { ApplicationManageView } from "../page/management/ApplicationManageView.jsx";
import { AlbaList } from "../page/management/AlbaList.jsx";
import { StoreList } from "../page/store/StoreList.jsx";
import { StoreRegister } from "../page/store/StoreRegister.jsx";
import { StoreView } from "../page/store/StoreView.jsx";
import { StoreEdit } from "../page/store/StoreEdit.jsx";

const bossRoutes = [
  /**
   * 알바 공고
   */
  { path: "jobs/register", element: <JobsRegister /> },
  { path: "jobs/list", element: <JobsList /> },
  { path: "jobs/:id", element: <JobsView /> },
  { path: "jobs/:id/edit", element: <JobsEdit /> },
  { path: "store/list", element: <StoreList /> },

  /**
   * 사업장
   */
  { path: "store/register", element: <StoreRegister /> },
  { path: "store/:id", element: <StoreView /> },
  { path: "store/edit/:id", element: <StoreEdit /> },

  /**
   * 지원서, 알바 관리
   */
  { path: "application-manage/list", element: <ApplicationMangeList /> },
  {
    path: "/jobs/:jobsId/application-manage/detail/:albaId",
    element: <ApplicationManageView />,
  },
  { path: "alba-list", element: <AlbaList /> },
];

export default bossRoutes;
