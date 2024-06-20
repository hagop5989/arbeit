import { Box, Center, Flex, Image, Link } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export function Profile() {
  const [src, setSrc] = useState("");

  const account = useContext(LoginContext);
  const isBoss = account.isBoss();

  useEffect(() => {
    if (account.id !== "") {
      axios.get(`/api/profile/${account.id}`).then((res) => setSrc(res.data));
    }
  }, [account.id]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
  };

  return (
    <Box width={"80%"}>
      <Center w="100%" h={"30px"} variant={"outline"} mt={"-20px"} mb={"20px"}>
        <FontAwesomeIcon
          icon={faArrowUp}
          onClick={scrollToTop}
          cursor={"pointer"}
        />
      </Center>
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
    </Box>
  );
}
