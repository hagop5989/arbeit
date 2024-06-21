import { Box, Center, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";
import { Footer } from "../component/Footer.jsx";
import { Profile } from "../component/Profile.jsx";
import { useContext } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { LeftNavbar } from "../navbar/LeftNavbar.jsx";

export function Home() {
  const account = useContext(LoginContext);

  return (
    <Box>
      <Navbar />
      <Flex>
        <LeftNavbar border={"1px solid red"} />
        <Center minWidth={"1050px"} width={"1050px"} margin={"auto"}>
          <Outlet />
        </Center>
        {account.isLoggedIn() && (
          <Center
            bg={"white"}
            border={"2px solid #E9E9E9"}
            position={"fixed"}
            right={"150px"}
            w={"200px"}
            h={"330px"}
            borderRadius={"10px"}
            display={{ base: "none", "2xl": "flex" }}
          >
            <Profile />
          </Center>
        )}
      </Flex>
      <Footer />
    </Box>
  );
}

export default Home;
