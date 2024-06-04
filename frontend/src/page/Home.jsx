import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar2 from "../component/Navbar2.jsx";

export function Home() {
  return (
    <Box>
      <Box>
        <Navbar2 />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Home;
