import React from "react";
import { Box, Checkbox, Flex, Text, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faList,
} from "@fortawesome/free-solid-svg-icons"; /* Sidebar.jsx 파일  */

/* Sidebar.jsx 파일  */
export const Sidebar = () => {
  return (
    <Box>
      <VStack
        spacing={4}
        borderRadius={"15px"}
        align="start"
        p={4}
        w="250px"
        h="85vh"
        bg="gray.100"
        borderRight="1px solid #e2e8f0"
      >
        <Text fontSize="xl" fontWeight="bold">
          나의 캘린더
        </Text>
        <Box h={"250px"}></Box>
        <Flex mt="15px">
          <Box w={"200px"} p={3} borderY={"1px solid gray"}>
            <Flex h={"20px"} lineHeight={"20px"}>
              <FontAwesomeIcon icon={faList} />
              <Text mx={2}>전체일정 목록</Text>
            </Flex>
          </Box>
        </Flex>
        <Box></Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            톡캘린더
          </Text>
          <Checkbox defaultischecked={"true"}>내 캘린더</Checkbox>{" "}
          <Checkbox> 할 일</Checkbox>
          <Checkbox>친구 생일</Checkbox>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            구독 캘린더
          </Text>
          <Checkbox>대한민국 기념일</Checkbox>
        </Box>
        <Box>
          <Text fontWeight="bold">
            <FontAwesomeIcon icon={faGear} /> 설정
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
