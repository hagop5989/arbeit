import { Box, Flex, Grid, Image, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

/**
 *
 */
export function JobDetail({ jobs, jobsCond, src }) {
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={8}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      bg="white"
    >
      <Box
        justifyContent="space-between"
        alignItems="center"
        w={"93%"}
        h={"150px"}
        ml={"40px"}
        mt={"10px"}
      >
        <Flex>
          <Box>
            <Text fontSize="sm" color="gray.500" ml={"5px"}>
              # {jobsCond.preferred}
            </Text>

            <Box
              fontSize="2xl"
              fontWeight="bold"
              letterSpacing={"1px"}
              w={"450px"}
              h={"110px"}
            >
              <Flex fontSize={"md"} color={"#616D8A"} ml={"5px"}>
                <Box>
                  <FontAwesomeIcon icon={faThumbtack} mr={"10px"} />
                </Box>
                <Box ml={"10px"}>{jobs.storeName}</Box>
              </Flex>
              <Box wordBreak={"break-word"} w={"100%"} ml={"5px"}>
                {jobs.title}
              </Box>
            </Box>
          </Box>
          <Spacer />
          <Box w={"200px"} h={"100px"}>
            <Image
              w={"100%"}
              h={"100%"}
              border={"1px solid lightgray"}
              borderRadius={"8px"}
              src={src}
              objectFit="contain"
            />
          </Box>
        </Flex>
      </Box>

      <Grid templateColumns="repeat(4, 1fr)" gap={6} textAlign="center">
        <Box>
          <Text fontSize="sm" color="gray.500">
            시급
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            {parseInt(jobs.salary).toLocaleString()} 원
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">
            기간
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            {jobsCond.workPeriod}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">
            요일
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            {jobsCond.workWeek}
          </Text>
        </Box>
        <Box maxH={"70px"}>
          <Text fontSize="sm" color="gray.500">
            시간
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {jobsCond.workTime}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}
