import { StoreList } from "../page/store/StoreList.jsx";
import { StoreRegister } from "../page/store/StoreRegister.jsx";
import { StoreView } from "../page/store/StoreView.jsx";
import { StoreEdit } from "../page/store/StoreEdit.jsx";

const storeRoutes = [
  { path: "store/list", element: <StoreList /> },
  { path: "store/register", element: <StoreRegister /> },
  { path: "store/:id", element: <StoreView /> },
  { path: "store/edit/:id", element: <StoreEdit /> },
  // TODO : Git add 해야함
  // { path: "store/announce", element: <StoreAnnounce /> },
];

export default storeRoutes;
