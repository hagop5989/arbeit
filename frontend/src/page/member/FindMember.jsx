import {
  Box,
  Heading,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FindEmail } from "./FindEmail.jsx";
import { FindPassword } from "./FindPassword.jsx";

export function FindMember() {
  return (
    <Box w={"500px"} h={"490px"}>
      <Box
        h={"60px"}
        mb={"30px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={"10px"}
      >
        <Heading size={"lg"} textAlign={"center"} lineHeight={"60px"}>
          내 정보 찾기
        </Heading>
      </Box>
      <Tabs isFitted position="relative" variant="unstyled">
        <TabList>
          <Tab>아이디 찾기</Tab>
          <Tab>비밀번호 찾기</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="orange" borderRadius="1px" />
        <TabPanels>
          <TabPanel>
            <FindEmail />
          </TabPanel>
          <TabPanel>
            <FindPassword />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
