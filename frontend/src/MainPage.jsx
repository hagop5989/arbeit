import { Box, Center, Flex, Image } from "@chakra-ui/react";
import {
  faBeerMugEmpty,
  faDesktop,
  faFaceLaughBeam,
  faFilm,
  faIndustry,
  faMotorcycle,
  faMugSaucer,
  faPaperclip,
  faRightToBracket,
  faScissors,
  faShop,
  faTruck,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react"; // 중복 스타일을 객체로 정의

// 중복 스타일을 객체로 정의
const buttonStyle = {
  width: "33.33%",
  borderRadius: "20px",
  borderBottom: "4px solid #CCD4E0",
  borderTop: "1px solid #CCD4E0",
  borderLeft: "1px solid #CCD4E0",
  borderRight: "1px solid #CCD4E0",
  fontSize: "20px",
  fontWeight: "700",
  transition: "transform 0.3s ease-in-out",
  _hover: {
    transform: "scale(0.95)",
  },
};

const needStyle = {
  width: "70%",
  borderRadius: "20px",
  borderBottom: "4px solid #CCD4E0",
  borderTop: "1px solid #CCD4E0",
  borderLeft: "1px solid #CCD4E0",
  borderRight: "1px solid #CCD4E0",
  fontSize: "20px",
  fontWeight: "700",
  transition: "transform 0.3s ease-in-out",
  _hover: {
    transform: "scale(0.95)",
  },
};

export function MainPage() {
  return (
    <Box w={"100%"} h={"600px"}>
      <Box height={"15%"}>
        <Image
          src="/public/main_page_logo.png"
          borderRadius={"10px"}
          h={"100%"}
        />
      </Box>
      <Center
        height={"40px"}
        bg={"#CCD4E0"}
        color={"black"}
        fontSize={"20px"}
        fontWeight={"700"}
        mt={"25px"}
        mb={"5px"}
        borderRadius={"10px"}
      >
        알바 공고 보러가기
      </Center>
      <Box height={"30%"} mb={"30px"}>
        <Flex w={"100%"} h={"50%"} mb={"1px"}>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faIndustry} />
            <Box mx={3}>생산업</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faScissors} />
            <Box mx={3}>미용</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faDesktop} />
            <Box mx={3}>사무업무</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faMugSaucer} />
            <Box mx={3}>카페</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faShop} />
            <Box mx={3}>편의점</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faBeerMugEmpty} />
            <Box mx={3}>술집</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
        </Flex>
        <Flex w={"100%"} h={"50%"}>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faFilm} />
            <Box mx={3}>영화관</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faFaceLaughBeam} />
            <Box mx={3}>놀이공원</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faMotorcycle} />
            <Box mx={3}>배달</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faUtensils} />
            <Box mx={3}>요식업</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faTruck} />
            <Box mx={3}>유통</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
          <Center {...buttonStyle} as="div">
            <FontAwesomeIcon icon={faPaperclip} />
            <Box mx={3}>기타</Box>
            <FontAwesomeIcon
              icon={faRightToBracket}
              fontSize={"20px"}
              color={"gray"}
            />
          </Center>
        </Flex>
      </Box>
      <Box
        w={"30%"}
        border={"1px solid green"}
        height={"50%"}
        borderRadius={"20px"}
      >
        <Center m={"10px"} fontSize={"1.5rem"}>
          알바 채용을 위한 첫 걸음
        </Center>
        <Center margin={"auto"} {...needStyle} as="div">
          <FontAwesomeIcon icon={faTruck} />
          <Box mx={3}>이력서 작성하기</Box>
          <FontAwesomeIcon
            icon={faRightToBracket}
            fontSize={"20px"}
            color={"gray"}
          />
        </Center>
        <Box>
          <Image
            mt={"30px"}
            ml={"100px"}
            src="/public/man1.png"
            height={"192px"}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default MainPage;
