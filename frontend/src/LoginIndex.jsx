import React, { useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

export function LoginIndex() {
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <LoginBox />
      </Flex>
    </ChakraProvider>
  );
}

export function LoginBox({ children }) {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Box
      maxW="md"
      width="100%"
      mx="auto"
      p={6}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>개인회원</Tab>
          <Tab>기업회원</Tab>
        </TabList>

        {/* 개인회원 */}
        <TabPanels>
          <TabPanel>
            <Stack spacing={4}>
              <Input placeholder="개인회원 이메일 입력" />
              <Input placeholder="비밀번호" type="password" />
              <Button colorScheme="blue" size="lg" width="full">
                로그인
              </Button>
              <Box textAlign="right" mt={2}>
                <Text as="a" href="#" mr={2}>
                  아이디 찾기
                </Text>
                <Text as="a" href="#" mr={2}>
                  비밀번호 찾기
                </Text>
                <Text as="a" href="#">
                  회원가입
                </Text>
              </Box>
            </Stack>
          </TabPanel>

          {/* 기업회원 */}
          <TabPanel>
            <Stack spacing={4}>
              <Input placeholder="기업회원 이메일 입력" />
              <Input placeholder="비밀번호" type="password" />
              <Button colorScheme="blue" size="lg" width="full">
                로그인
              </Button>
              <Box textAlign="right" mt={2}>
                <Text as="a" href="#" mr={2}>
                  아이디 찾기
                </Text>
                <Text as="a" href="#" mr={2}>
                  비밀번호 찾기
                </Text>
                <Text as="a" href="#">
                  회원가입
                </Text>
              </Box>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default LoginIndex;
