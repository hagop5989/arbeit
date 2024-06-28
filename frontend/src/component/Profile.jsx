import { Box, Center, Flex, Image, Link, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../provider/LoginProvider.jsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export function Profile() {
  const [src, setSrc] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const account = useContext(LoginContext);
  const isBoss = account.isBoss();

  useEffect(() => {
    if (account.id !== "") {
      axios.get(`/api/profile/${account.id}`).then((res) => setSrc(res.data));
    }
  }, [account.id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250); // 높이 700넘으면 보임
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
  };

  return (
    <Flex>
      <Box w={"85px"} pt={"15px"}>
        <Center w={"85px"} height={"80px"} mb={"10px"}>
          <Image
            borderRadius={300}
            border={"1px solid gray"}
            src={src === "" ? "/public/base_profile.png" : src}
          />
        </Center>
        <Center h={"20px"} mb={"15px"}>
          <Link href={`/member/${account.id}`}>내 정보</Link>
        </Center>
      </Box>
      <Box w={"170px"} px={"20px"} margin={"auto"}>
        <Flex w={"100%"}>
          <Link
            href={isBoss ? "/application-manage/list" : "/application/list"}
          >
            지원내역
          </Link>
          <Center
            w={"20px"}
            h={"20px"}
            bg={"yellow"}
            borderRadius={150}
            ml={"5px"}
          >
            {account.alarmNum}
          </Center>
        </Flex>
        <Flex w={"100%"}>
          <Link href={"/scrap-history"}>스크랩 알바</Link>
          <Center
            w={"20px"}
            h={"20px"}
            bg={"yellow"}
            borderRadius={150}
            ml={"5px"}
          >
            {account.scrapNum}
          </Center>
        </Flex>
        <Flex w={"100%"}>
          <Link href={"/visit-history"}>최근 본 알바</Link>
          <Center
            w={"20px"}
            h={"20px"}
            bg={"yellow"}
            borderRadius={150}
            ml={"5px"}
          >
            {account.recentJobPages.length}
          </Center>
        </Flex>
        <Flex w={"100%"}>
          <Link href={"/alba-list"}>직원 목록</Link>
        </Flex>
      </Box>
      <Center>
        {showScrollTop && (
          <Box
            onClick={scrollToTop}
            cursor={"pointer"}
            bgColor={"white"}
            position={"fixed"}
            w="60px"
            h={"60px"}
            bottom={"250px"}
            right={"50px"}
            border={"1px solid lightgray"}
            borderRadius={"50%"}
          >
            <Center w="100%" h={"30px"} variant={"outline"}>
              <FontAwesomeIcon icon={faArrowUp} />
            </Center>
            <Text mt={"-5px"} textAlign={"center"} fontWeight={"bold"}>
              TOP
            </Text>
          </Box>
        )}
      </Center>
    </Flex>
  );
}
