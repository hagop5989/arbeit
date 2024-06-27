import {
  Box,
  Button,
  Divider,
  HStack,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "../../../provider/LoginProvider.jsx";

/**
 * 모집 조건
 */
export function JobRequirements({ onOpen, job, jobsCond, id }) {
  const account = useContext(LoginContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // 연도와 날짜만 추출
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString(undefined, options);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Tabs
        variant="unstyled"
        mb={"-30px"}
        defaultIndex={0}
        sx={{
          borderBottom: "1px solid lightgray",
          "& .chakra-tabs__tab": {
            color: "gray",
            bg: "#f7f7f7",
            border: "1px solid lightgray",
            borderBottom: "none",
            _selected: {
              fontSize: "18px",
              color: "red.500",
              fontWeight: "bold",
              bg: "white",
              borderColor: "lightgray",
              borderBottom: "none",
            },
            _focus: {
              boxShadow: "none",
            },
          },
          "& .chakra-tabs__tab-list": {
            borderBottom: "none",
          },
        }}
      >
        <TabList h={"50px"}>
          <Tab onClick={() => scrollToSection("모집조건")} w={"33.3%"}>
            모집조건
          </Tab>
          <Tab onClick={() => scrollToSection("상세요강")} w={"33.3%"}>
            상세요강
          </Tab>
          <Tab onClick={() => scrollToSection("기업정보")} w={"34%"}>
            기업정보
          </Tab>
        </TabList>
      </Tabs>
      <Box
        id={"모집조건"}
        w={"full"}
        maxW={"800px"}
        p={10}
        borderWidth="1px"
        borderRadius="lg"
        border={"1px solid lightgray"}
        bg="white"
      >
        <Text fontSize="2xl" my={2} fontWeight="bold">
          모집조건
        </Text>
        <Divider mb={4} />
        <Box mx={3}>
          <HStack spacing={10} w="full" alignItems="start">
            <VStack align="start" spacing={3} w="440px">
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  모집마감
                </Text>
                <Text ml={"0px"}>{formatDate(job.deadline)}</Text>
              </Box>
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  모집인원
                </Text>
                <Text ml={"0px"}>{job.recruitmentNumber} 명</Text>
              </Box>
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  성별
                </Text>
                <Text ml={"0px"}>{"성별 무관"} </Text>
              </Box>
            </VStack>
            <VStack align="start" spacing={3} w="440px" ml={"40px"}>
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  학력
                </Text>
                <Text ml={"0px"}>
                  {jobsCond.education} {jobsCond.educationDetail}
                </Text>
              </Box>
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  연령
                </Text>
                {jobsCond.age > 0 && (
                  <Text ml={"0px"}>{jobsCond.age} 세 이상</Text>
                )}
                {jobsCond.age == 0 && <Text ml={"0px"}>연령 무관</Text>}
              </Box>

              <Box my={2} display={"flex"}>
                <Text minW={"95px"} fontSize={"lg"} fontWeight="bold">
                  우대사항
                </Text>
                <Text ml={"0px"}>{jobsCond.preferred}</Text>
              </Box>
            </VStack>
          </HStack>
          {account.isAlba() && (
            <Button onClick={onOpen} colorScheme="red" w="full" my={"10px"}>
              지원하기
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
