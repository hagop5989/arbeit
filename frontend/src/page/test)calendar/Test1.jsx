import React from "react";
import { Box, Flex } from "@chakra-ui/react";

import CenterCalendar from "./CenterCalendar.jsx";
import Sidebar from "./Sidebar.jsx";

function Test1(props) {
  return (
    <Box>
      <Flex>
        <Sidebar />
        <CenterCalendar />
      </Flex>
    </Box>
  );
}

export default Test1;
