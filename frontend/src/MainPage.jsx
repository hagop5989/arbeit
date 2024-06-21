import { Box, Center, Flex, Image } from "@chakra-ui/react";
import {
  faDesktop,
  faIndustry,
  faPaperclip,
  faRightToBracket,
  faScissors,
  faTruck,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 중복 스타일을 객체로 정의
const buttonStyle = {
  width: "33.33%",
  borderRadius: "20px",
  borderBottom: "4px solid #CCD4E0",
  borderTop: "1px solid #CCD4E0",
  borderLeft: "1px solid #CCD4E0",
  borderRight: "1px solid #CCD4E0",
  fontSize: "30px",
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
      <Box height={"40%"} mb={"30px"}>
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
        </Flex>
        <Flex w={"100%"} h={"50%"}>
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
      <Box border={"1px solid green"} height={"20%"}></Box>
    </Box>
  );
}

export default MainPage;
