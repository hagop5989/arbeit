import {
  Box,
  Center,
  Flex,
  Image,
  List,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import albamonImage from "./albamon.png";

export function Test1() {
  // 헤드 Nav
  const HeadNav = () => {
    return (
      <Box
        h={"140px"}
        bgColor={"coral"}
        border={"1px solid black"}
        borderRadius={"8px"}
      ></Box>
    );
  };

  // 사이드 바
  const SideNav = () => {
    return (
      <Box
        id={"rightNav"}
        borderRadius={"8px"}
        w={"200px"}
        h={"54vh"}
        bgColor={"teal"}
        color={"white"}
        m={"20px"}
        mt={"100px"}
      >
        <ul>
          <Text> ▲Top 으로 이동</Text>
          <li>aaaaa</li>
          <li>bbbbb</li>
          <li>cccc</li>
        </ul>
        <Box w={"100%"} h={"200px"} mt={5} bgColor={"orange"}></Box>
      </Box>
    );
  };

  // 바디
  const Body = () => {
    return (
      <Box>
        {" "}
        <Center>
          <Flex>
            <SideNav />
            <Box id={"body"} w={"55vw"}>
              <Box h={"85vh"} bgColor={"lightblue"} border={"1px solid black"}>
                <Image src={albamonImage} w={"100%"} h={"100%"} />
              </Box>
            </Box>
            <SideNav />
          </Flex>
        </Center>
      </Box>
    );
  };

  // 푸터
  const Footer = () => {
    return (
      <Box>
        <Box
          // border={"1px solid red"}
          borderRadius={"8px"}
          id={"footer"}
          // p={2}
          w={"100%"}
          h={"100px"}
          bgColor={"navajowhite"}
        ></Box>
      </Box>
    );
  };

  return (
    <Box bgColor={"lightgray"}>
      <HeadNav />
      <Body />
      <Footer />
    </Box>
  );
}
