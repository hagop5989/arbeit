import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";

export function Home() {
  return (
    <Box>
      <Box>
        <Navbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Home;
