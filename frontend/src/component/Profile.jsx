import { Box, Center, Flex, Image, Link } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export function Profile() {
  const [src, setSrc] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const account = useContext(LoginContext);
  const isBoss = account.isBoss();

  useEffect(() => {
    if (account.id !== "") {
      axios.get(`/api/profile/${account.id}`).then((res) => setSrc(res.data));
    }

    // 스크롤 이벤트 리스너 추가
    const handleScroll = () => {
      if (window.scrollY > 700) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [account.id]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
  };

  return (
    <Box width={"80%"}>
      <Center w={"100%"} height={"140px"} mb={"10px"}>
        <Image
          borderRadius={150}
          border={"2px solid gray"}
          w={"90%"}
          h={"100%"}
          src={src === "" ? "/public/base_profile.png" : src}
          //objectFit={"contain"}
        />
      </Center>
      <Center h={"20px"} mb={"15px"}>
        <Link href={`/member/${account.id}`}>내 정보</Link>
      </Center>
      <Flex w={"100%"} h={"20px"} mb={"5px"} ml={"20px"}>
        <Link href={isBoss ? "/jobs/management/list" : "/apply/list"}>
          지원 내역
        </Link>
        {isBoss && (
          <Center
            w={"20px"}
            h={"20px"}
            bg={"yellow"}
            borderRadius={150}
            ml={"5px"}
          >
            {account.alarmNum}
          </Center>
        )}
      </Flex>
      <Flex w={"100%"} h={"20px"} mb={"5px"} ml={"20px"}>
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
      <Flex w={"100%"} h={"20px"} ml={"20px"}>
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
      {showScrollButton && (
        <Box position={"absolute"} bottom={"-400px"} left={"135px"}>
          <Center
            w="60px"
            h={"60px"}
            fontSize={"14px"}
            variant={"outline"}
            bgColor={"white"}
            color={"gray.600"}
            border={"1px solid lightgray"}
            borderRadius={"50%"}
            mt={"-20px"}
            mb={"20px"}
          >
            <Flex direction="column" alignItems="center" fontWeight={"bold"}>
              <FontAwesomeIcon
                icon={faArrowUp}
                onClick={scrollToTop}
                cursor={"pointer"}
              />
              <Box mt="2px">Top</Box>
            </Flex>
          </Center>
        </Box>
      )}
    </Box>
  );
}
