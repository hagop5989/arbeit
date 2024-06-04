import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";
import { Navbar } from "../comment/Navbar.jsx";

export function Home() {
  return (
    <Box>
      <Navbar />
      <Outlet />
    </Box>
  );
}
