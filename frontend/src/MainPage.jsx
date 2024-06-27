import { Box, Center, Flex, Image } from "@chakra-ui/react";
import {
  faAddressBook,
  faBeerMugEmpty,
  faDesktop,
  faFaceLaughBeam,
  faFileCircleCheck,
  faFileCirclePlus,
  faFilm,
  faFlag,
  faIndustry,
  faKey,
  faList,
  faMotorcycle,
  faMugSaucer,
  faPaperclip,
  faRightToBracket,
  faScissors,
  faShop,
  faTruck,
  faUserPlus,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./provider/LoginProvider.jsx"; // 중복 스타일을 객체로 정의

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
  marginTop: "10px",
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
  const [hoveredBox, setHoveredBox] = useState(null);
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const handleMouseEnter = (box) => {
    setHoveredBox(box);
  };

  const handleMouseLeave = () => {
    setHoveredBox(null);
  };
  return (
    <Box w={"100%"} h={"600px"}>
      <Box height={"15%"}>
        <Image
          src="/public/main_page_logo.png"
          borderRadius={"10px"}
          h={"100%"}
        />
      </Box>
      {account.isAlba() && (
        <>
          <Center
            height={"40px"}
            bg={"#CCD4E0"}
            color={"black"}
            fontSize={"1.5rem"}
            fontWeight={"700"}
            mt={"25px"}
            mb={"5px"}
            borderRadius={"10px"}
          >
            알바 채용을 위한 첫 걸음
          </Center>
          <Flex>
            <Box
              w={"30%"}
              border={"2px solid #CCD4E0"}
              height={"50%"}
              borderRadius={"20px"}
              onMouseEnter={() => handleMouseEnter("box1")}
              onMouseLeave={handleMouseLeave}
            >
              <Center
                margin={"auto"}
                {...needStyle}
                as="div"
                cursor={"pointer"}
                onClick={() => navigate("/resume/register")}
              >
                <FontAwesomeIcon icon={faFileCirclePlus} />
                <Box color={"#ff5a3d"} mx={3}>
                  이력서 작성하기
                </Box>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  fontSize={"20px"}
                  color={"gray"}
                />
              </Center>
              <Box>
                <Image
                  src={
                    hoveredBox === "box1"
                      ? "/write-export.gif"
                      : "/write-export.png"
                  }
                  height={"128px"}
                  mt={"50px"}
                  ml={"100px"}
                />
              </Box>
            </Box>
            <Box
              ml={"5%"}
              w={"30%"}
              border={"2px solid #CCD4E0"}
              height={"50%"}
              borderRadius={"20px"}
              onMouseEnter={() => handleMouseEnter("box2")}
              onMouseLeave={handleMouseLeave}
            >
              <Center
                margin={"auto"}
                {...needStyle}
                as="div"
                cursor={"pointer"}
                onClick={() => navigate("/resume/list")}
              >
                <FontAwesomeIcon icon={faFileCircleCheck} />
                <Box color={"#ff5a3d"} mx={3}>
                  이력서 확인하기
                </Box>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  fontSize={"20px"}
                  color={"gray"}
                />
              </Center>
              <Box>
                <Image
                  src={
                    hoveredBox === "box2"
                      ? "/scan-export.gif"
                      : "/scan-export.png"
                  }
                  height={"128px"}
                  mt={"50px"}
                  ml={"100px"}
                />
              </Box>
            </Box>
            {/*<Box*/}
            {/*  ml={"5%"}*/}
            {/*  w={"30%"}*/}
            {/*  border={"2px solid #CCD4E0"}*/}
            {/*  height={"50%"}*/}
            {/*  borderRadius={"20px"}*/}
            {/*  onMouseEnter={() => handleMouseEnter("box3")}*/}
            {/*  onMouseLeave={handleMouseLeave}*/}
            {/*>*/}
            {/*  <Center*/}
            {/*    margin={"auto"}*/}
            {/*    {...needStyle}*/}
            {/*    as="div"*/}
            {/*    cursor={"pointer"}*/}
            {/*    onClick={() => navigate("/jobs/list")}*/}
            {/*  >*/}
            {/*    <FontAwesomeIcon icon={faThumbtack} />*/}
            {/*    <Box mx={3}>공고 확인하기</Box>*/}
            {/*    <FontAwesomeIcon*/}
            {/*      icon={faRightToBracket}*/}
            {/*      fontSize={"20px"}*/}
            {/*      color={"gray"}*/}
            {/*    />*/}
            {/*  </Center>*/}
            {/*  <Box>*/}
            {/*    <Image*/}
            {/*      src={*/}
            {/*        hoveredBox === "box3"*/}
            {/*          ? "/public/job-export.gif"*/}
            {/*          : "/public/job-export.png"*/}
            {/*      }*/}
            {/*      height={"128px"}*/}
            {/*      mt={"50px"}*/}
            {/*      ml={"100px"}*/}
            {/*    />*/}
            {/*  </Box>*/}
            {/*</Box>*/}
          </Flex>
        </>
      )}
      {/*사장 쪽*/}
      {account.isBoss() && (
        <>
          <Center
            height={"40px"}
            bg={"#CCD4E0"}
            color={"black"}
            fontSize={"1.5rem"}
            fontWeight={"700"}
            mt={"25px"}
            mb={"5px"}
            borderRadius={"10px"}
          >
            사장 메뉴
          </Center>
          <Flex>
            <Box
              ml={"5%"}
              w={"40%"}
              border={"2px solid #CCD4E0"}
              height={"50%"}
              borderRadius={"20px"}
              onMouseEnter={() => handleMouseEnter("box1")}
              onMouseLeave={handleMouseLeave}
            >
              <Center
                margin={"auto"}
                {...needStyle}
                as="div"
                cursor={"pointer"}
                onClick={() => navigate("/jobs/register")}
              >
                <FontAwesomeIcon icon={faFileCirclePlus} />
                <Box color={"#ff5a3d"} mx={3}>
                  공고 등록
                </Box>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  fontSize={"20px"}
                  color={"gray"}
                />
              </Center>
              <Box>
                <Image
                  src={
                    hoveredBox === "box1"
                      ? "/new-export.gif"
                      : "/new-export.png"
                  }
                  height={"128px"}
                  mt={"50px"}
                  ml={"80px"}
                />
              </Box>
            </Box>
            <Box
              ml={"10%"}
              w={"40%"}
              border={"2px solid #CCD4E0"}
              height={"50%"}
              borderRadius={"20px"}
              onMouseEnter={() => handleMouseEnter("box2")}
              onMouseLeave={handleMouseLeave}
            >
              <Center
                margin={"auto"}
                {...needStyle}
                as="div"
                cursor={"pointer"}
                onClick={() => navigate("/resume/list")}
              >
                <FontAwesomeIcon icon={faList} />
                <Box color={"#ff5a3d"} mx={3}>
                  나의 공고 목록
                </Box>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  fontSize={"20px"}
                  color={"gray"}
                />
              </Center>
              <Box>
                <Image
                  src={
                    hoveredBox === "box2"
                      ? "/com-export.gif"
                      : "/com-export.png"
                  }
                  height={"128px"}
                  mt={"50px"}
                  ml={"80px"}
                />
              </Box>
            </Box>
          </Flex>
          <Flex mt={"20px"}>
            <Box
              ml={"5%"}
              w={"40%"}
              border={"2px solid #CCD4E0"}
              height={"50%"}
              borderRadius={"20px"}
              onMouseEnter={() => handleMouseEnter("box3")}
              onMouseLeave={handleMouseLeave}
            >
              <Center
                margin={"auto"}
                {...needStyle}
                as="div"
                cursor={"pointer"}
                onClick={() => navigate("/jobs/management/list")}
              >
                <FontAwesomeIcon icon={faAddressBook} />
                <Box color={"#ff5a3d"} mx={3}>
                  지원 내역
                </Box>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  fontSize={"20px"}
                  color={"gray"}
                />
              </Center>
              <Box>
                <Image
                  src={
                    hoveredBox === "box3"
                      ? "/papers-export.gif"
                      : "/papers-export.png"
                  }
                  height={"128px"}
                  mt={"50px"}
                  ml={"80px"}
                />
              </Box>
            </Box>
            <Box
              ml={"10%"}
              w={"40%"}
              border={"2px solid #CCD4E0"}
              height={"50%"}
              borderRadius={"20px"}
              onMouseEnter={() => handleMouseEnter("box4")}
              onMouseLeave={handleMouseLeave}
            >
              <Center
                margin={"auto"}
                {...needStyle}
                as="div"
                cursor={"pointer"}
                onClick={() => navigate("/store/list")}
              >
                <FontAwesomeIcon icon={faFlag} />
                <Box color={"#ff5a3d"} mx={3}>
                  나의 사업장 목록
                </Box>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  fontSize={"20px"}
                  color={"gray"}
                />
              </Center>
              <Box>
                <Image
                  src={
                    hoveredBox === "box4"
                      ? "/store-export.gif"
                      : "/store-export.png"
                  }
                  height={"128px"}
                  mt={"50px"}
                  ml={"80px"}
                />
              </Box>
            </Box>
          </Flex>
        </>
      )}
      {!account.isLoggedIn() && (
        <>
          <Flex mt={"20px"}>
            <Box
              ml={"30%"}
              w={"40%"}
              border={"2px solid #CCD4E0"}
              height={"50%"}
              borderRadius={"20px"}
              onMouseEnter={() => handleMouseEnter("box1")}
              onMouseLeave={handleMouseLeave}
            >
              <Center
                margin={"auto"}
                {...needStyle}
                as="div"
                cursor={"pointer"}
                onClick={() => navigate("/login")}
              >
                <FontAwesomeIcon icon={faKey} />
                <Box color={"#ff5a3d"} mx={3}>
                  로그인
                </Box>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  fontSize={"20px"}
                  color={"gray"}
                />
              </Center>
              <Center
                margin={"auto"}
                {...needStyle}
                as="div"
                cursor={"pointer"}
                onClick={() => navigate("/signup")}
              >
                <FontAwesomeIcon icon={faUserPlus} />
                <Box color={"#ff5a3d"} mx={3}>
                  회원가입
                </Box>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  fontSize={"20px"}
                  color={"gray"}
                />
              </Center>
              <Box>
                <Image
                  src={
                    hoveredBox === "box1"
                      ? "/lock-export.gif"
                      : "/lock-export.png"
                  }
                  height={"128px"}
                  mt={"10px"}
                  ml={"140px"}
                />
              </Box>
            </Box>
          </Flex>
        </>
      )}
      {!account.isBoss() && (
        <>
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
        </>
      )}
    </Box>
  );
}

export default MainPage;
