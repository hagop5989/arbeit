import { StoreList } from "../page/store/StoreList.jsx";
import { StoreRegister } from "../page/store/StoreRegister.jsx";

const storeRoutes = [
  { path: "store/list", element: <StoreList /> },
  { path: "store/add", element: <StoreRegister /> },
];

export default storeRoutes;
