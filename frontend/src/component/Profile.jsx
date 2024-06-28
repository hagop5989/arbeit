import { Box, Button, Center, Flex, Link, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const styles = {
  menu: {
    w: "100%",
    p: "5px",
    borderBottom: "1px solid #E0E0E0",
  },
  btn: {
    w: "100%",
    bg: "#3396FE",
    fontFamily: "SBAggroB",
    color: "white",
  },
};

export function Profile() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  const account = useContext(LoginContext);
  const isBoss = account.isBoss();

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
    <Box w={"100%"}>
      <Box {...styles.menu}>
        {account.isLoggedIn() || (
          <Button onClick={() => navigate("/signup")} {...styles.btn}>
            회원가입
          </Button>
        )}
        {account.isAlba() && (
          <Button
            onClick={() => navigate("/resume/register")}
            {...styles.btn}
            fontSize={"15px"}
          >
            이력서 등록하기
          </Button>
        )}
        {account.isBoss() && (
          <Button
            onClick={() => navigate("/jobs/register")}
            {...styles.btn}
            fontSize={"15px"}
          >
            공고 등록하기
          </Button>
        )}
      </Box>
      <Box w={"100%"} px={"10px"} mt={"5px"}>
        {account.isLoggedIn() && (
          <Box {...styles.menu}>
            <Link href={`/member/${account.id}`}>마이페이지</Link>
          </Box>
        )}
        {account.isLoggedIn() || (
          <Box {...styles.menu}>
            <Link href={`/login`}>마이페이지</Link>
          </Box>
        )}
        <Box {...styles.menu}>
          <Link
            href={isBoss ? "/application-manage/list" : "/application/list"}
          >
            지원내역
            <Box fontSize={"13px"}>
              {account.alarmNum}건 <FontAwesomeIcon icon={faChevronRight} />
            </Box>
          </Link>
        </Box>
        <Box {...styles.menu}>
          <Link href={"/scrap-history"}>
            스크랩 알바
            <Box fontSize={"13px"}>
              {account.scrapNum}건 <FontAwesomeIcon icon={faChevronRight} />
            </Box>
          </Link>
        </Box>
        <Box {...styles.menu}>
          <Link href={"/visit-history"}>
            최근 본 알바
            <Box fontSize={"13px"}>
              {account.recentJobPages.length}건{" "}
              <FontAwesomeIcon icon={faChevronRight} />
            </Box>
          </Link>
        </Box>
        <Flex {...styles.menu}>
          {account.isLoggedIn() || (
            <Link href={"/jobs/list"}>채용공고 보러가기</Link>
          )}
          {account.isAlba() && (
            <Link href={"/jobs/list"}>채용공고 보러가기</Link>
          )}
          {account.isBoss() && (
            <Link href={"/alba-list"}>내 지점 직원 목록</Link>
          )}
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
    </Box>
  );
}
