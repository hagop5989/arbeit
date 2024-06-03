import React from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

function Home(props) {
  return (
    <Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Home;
