import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SignupComponent } from "./SignupComponent.jsx";
import { Helmet } from "react-helmet";

export function MemberSignup() {
  const [member, setMember] = useState({
    authority: "ALBA",
    gender: "MALE",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState({});

  function handleAuthTab(authority) {
    setMember({ ...member, authority });
    if (member.authority === "ALBA") {
      setIsAdmin(false);
    }
  }

  function handleSwitchChange() {
    if (isAdmin === true) {
      setIsAdmin(false);
      setMember({ ...member, authority: "BOSS" });
    } else {
      setIsAdmin(true);
      setMember({ ...member, authority: "ADMIN" });
    }
  }

  return (
    <Box w={"700px"}>
      <Helmet>
        <title>회원가입 - 알바커넥터</title>
      </Helmet>
      <Box
        h={"60px"}
        mb={"30px"}
        bgGradient="linear(to-r, orange.500, orange.300)"
        color={"white"}
        borderTopRadius={"10px"}
      >
        <Heading
          size={"lg"}
          textAlign={"center"}
          lineHeight={"60px"}
          fontFamily={"SBAggroB"}
        >
          회원가입
        </Heading>
      </Box>
      <Tabs isFitted position="relative" variant="unstyled">
        <TabList>
          <Tab onClick={() => handleAuthTab("ALBA")}>알바</Tab>
          <Tab onClick={() => handleAuthTab("BOSS")}>기업</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="#FF6435"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            <SignupComponent
              member={member}
              setMember={setMember}
              errors={errors}
              setErrors={setErrors}
            />
          </TabPanel>
          <TabPanel>
            <FormControl display="flex" alignItems="center" mb="15px">
              <FormLabel
                htmlFor="isAdmin"
                mb={"0"}
                color={isAdmin ? "black" : "gray"}
              >
                관리자로 회원가입
              </FormLabel>
              <Switch
                id="isAdmin"
                onChange={handleSwitchChange}
                isChecked={isAdmin}
              />
            </FormControl>
            <SignupComponent
              member={member}
              setMember={setMember}
              errors={errors}
              setErrors={setErrors}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
