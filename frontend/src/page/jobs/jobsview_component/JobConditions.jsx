import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import React from "react";

// 근무 조건
export function JobConditions({ job, jobsCond }) {
  return (
    <Box
      w={"100%"}
      maxW={"800px"}
      p={10}
      borderRadius="lg"
      border={"1px solid lightgray"}
    >
      <Text fontWeight="bold" fontSize="2xl" my={2}>
        근무조건
      </Text>
      <Divider />
      <Flex justifyContent="space-between" p={2} fontSize={"17px"}>
        <Box w={"440px"} mx={"10px"}>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              급여
            </Text>
            <Text ml={"0px"}> {parseInt(job.salary).toLocaleString()}원</Text>
          </Box>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              기간
            </Text>
            <Text ml={"0px"}> {jobsCond.workPeriod}</Text>
          </Box>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              요일
            </Text>
            <Text ml={"0px"}> {jobsCond.workWeek}</Text>
          </Box>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              시간
            </Text>
            <Text w={"160px"} ml={"0px"}>
              {jobsCond.workTime}
            </Text>
          </Box>
        </Box>
        <Box w={"440px"} mx={"10px"}>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              업직종
            </Text>
            <Text ml={"10px"}>{job.categoryName}</Text>
          </Box>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              고용형태
            </Text>
            <Text ml={"10px"}>{"알바"}</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
