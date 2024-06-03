import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AlbaSignup } from "./page/alba/AlbaSignup.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "./page/Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <div>index 화면</div> },
      { path: "alba/signup", element: <AlbaSignup /> },
    ],
  },
]);
function App() {
  return (
    <div>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </div>
  );
}

export default App;
