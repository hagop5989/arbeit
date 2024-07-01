import { Box, Center, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";
import { Footer } from "../component/Footer.jsx";
import { Profile } from "../component/Profile.jsx";
import { LeftNavbar } from "../component/LeftNavbar.jsx";

export function Home() {
  return (
    <Box>
      <Navbar />
      <Flex>
        <LeftNavbar />
        <Center
          minWidth={"1050px"}
          minHeight={"450px"}
          width={"1050px"}
          margin={"auto"}
          mb={"100px"}
        >
          <Outlet />
        </Center>
        <Center
          bg={"white"}
          border={"2px solid #E9E9E9"}
          position={"fixed"}
          top={"180px"}
          right={{ base: "0px", "2xl": "200px" }}
          w={"150px"}
          h={"300px"}
          borderRadius={"10px"}
          display={{ base: "none", xl: "flex" }}
        >
          <Profile />
        </Center>
      </Flex>
      <Footer />
    </Box>
  );
}

export default Home;
