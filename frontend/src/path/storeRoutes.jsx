import { StoreList } from "../page/store/StoreList.jsx";
import { StoreRegister } from "../page/store/StoreRegister.jsx";
import { StoreView } from "../page/store/StoreView.jsx";
import { StoreEdit } from "../page/store/storeEdit.jsx";

const storeRoutes = [
  { path: "store/list", element: <StoreList /> },
  { path: "store/add", element: <StoreRegister /> },
  { path: "store/:id", element: <StoreView /> },
  { path: "store/edit/:id", element: <StoreEdit /> },
];

export default storeRoutes;
