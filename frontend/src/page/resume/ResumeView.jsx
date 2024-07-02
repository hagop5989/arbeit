import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";

const styles = {
  title: {
    w: "80px",
    h: "30px",
    lineHeight: "30px",
    fontSize: "md",
    fontWeight: "bold",
    mr: "20px",
  },
};

export function ResumeView() {
  const { id } = useParams();
  const [resume, setResume] = useState({});
  const [userName, setUserName] = useState("");
  const [profileSrc, setProfileSrc] = useState("");
  const [nowAge, setNowAge] = useState("");
  const initialIndex = resume.isRookie === 1 ? 0 : 1;
  const toast = useToast();
  const navigate = useNavigate();

  const account = useContext(LoginContext);

  // 나이 계산
  const countNowAge = () => {
    const currentTime = Date.now();
    const birthTime = new Date(resume.birthDate).getTime();
    const ageInMilliseconds = currentTime - birthTime;
    const ageInYears = Math.floor(
      ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25),
    ); // 윤년을 고려하여 365.25로 나눔
    setNowAge(ageInYears);
  };

  useEffect(() => {
    axios
      .get(`/api/resume/${id}`)
      .then((res) => {
        setResume(res.data.resume);
        setUserName(res.data.userName);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          navigate("/");
        }
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
    if (resume.memberId !== undefined) {
      getProfilePicture();
    }
    if (resume) {
      countNowAge();
    }
  }, [resume.memberId]);

  function getProfilePicture() {
    axios
      .get(`/api/profile/${resume.memberId}`)
      .then((res) => {
        setProfileSrc(res.data);
      })
      .catch(() =>
        toast({
          status: "error",
          description: "내부 오류 발생",
          position: "top",
        }),
      )
      .finally();
  }

  //  핸드폰 번호 - 붙여서 보여주기 (실제론 아님)
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  function handlePrevClick() {
    navigate("/resume/list");
  }

  return (
    <>
      {account.isLoggedIn() && (
        <Box w="full" maxW="70%" mx="auto" p={5}>
          <Box>
            <Heading p={1} fontFamily={"SBAggroB"}>
              이력서
            </Heading>
            <Box my={"20px"} h={"50px"} lineHeight={"50px"} mb={"50px"}>
              * 이력서는 알바생 본인 및 지원한 사장님만 볼 수 있습니다.
            </Box>
            <Box align={"right"} fontSize={"sm"}>
              등록일 : {resume.inserted}
            </Box>
            <Box
              fontFamily={"SBAggroB"}
              textIndent={"10px"}
              borderY={"1px solid #E0E0E0"}
              h={"60px"}
              lineHeight={"60px"}
              mb={"40px"}
            >
              {resume.title}
            </Box>
            <Flex flexDirection={"column"}>
              <Flex mb={"40px"}>
                <Box w={"170px"} h={"170px"}>
                  <Image
                    w={"100%"}
                    h={"100%"}
                    border={"1px solid gray"}
                    borderRadius={"50%"}
                    src={
                      profileSrc === ""
                        ? "/public/base_profile.png"
                        : profileSrc
                    }
                    objectFit={"contain"}
                  />
                </Box>
                <Box w={"50%"} ml={"50px"} lineHeight={"30px"}>
                  <Box display={"flex"} mb={"5px"}>
                    <Box {...styles.title}>이름</Box>
                    <Box>{userName}</Box>
                  </Box>

                  <Box display={"flex"} mb={"5px"}>
                    <Box {...styles.title}>생년월일</Box>
                    <Box>
                      {resume.birthDate} (만 {nowAge}세)
                    </Box>
                  </Box>

                  <Box display={"flex"} mb={"5px"}>
                    <Box {...styles.title}>성별</Box>
                    <Box>{resume.gender == "MALE" ? "남성" : "여성"}</Box>
                  </Box>

                  <Box display={"flex"} mb={"5px"}>
                    <Box {...styles.title}>연락처</Box>
                    <Box>{formatPhoneNumber(resume.phone)}</Box>
                  </Box>

                  <Box display={"flex"}>
                    <Box {...styles.title}>이메일</Box>
                    <Box>{resume.email}</Box>
                  </Box>
                </Box>
              </Flex>

              <Box
                mb={4}
                h={"200px"}
                p={"15px"}
                bg={"#EDF2F7"}
                borderRadius={"10px"}
              >
                <Box
                  w={"100px"}
                  fontSize={"lg"}
                  fontWeight={"bold"}
                  color={"gray.600"}
                  mb={"10px"}
                >
                  자기소개
                </Box>
                <Box>{resume.content}</Box>
              </Box>

              <Flex mb={"40px"}>
                <Box
                  w={"100px"}
                  h="40px"
                  ml={"15px"}
                  lineHeight="40px"
                  fontSize={"lg"}
                  fontWeight={"bold"}
                >
                  경력여부
                </Box>
                <Tabs index={initialIndex}>
                  <TabList>
                    <Tab
                      w={"70px"}
                      h={"40px"}
                      border={"1px solid lightgray"}
                      onClick={(e) => e.preventDefault()} // 클릭 이벤트 무효화
                    >
                      신입
                    </Tab>
                    <Tab
                      w={"70px"}
                      h={"40px"}
                      border={"1px solid lightgray"}
                      onClick={(e) => e.preventDefault()} // 클릭 이벤트 무효화
                    >
                      경력
                    </Tab>
                  </TabList>
                </Tabs>
              </Flex>

              <Flex
                gap={"10px"}
                borderTop={"1px solid #E0E0E0"}
                h={"80px"}
                pt={"30px"}
              >
                <Button
                  size={"md"}
                  bgColor={"gray.500"}
                  color={"white"}
                  onClick={handlePrevClick}
                >
                  이전으로
                </Button>
                {account.hasAccess(resume.memberId) && (
                  <Button
                    size={"md"}
                    bgColor={"#FF7F3E"}
                    color={"white"}
                    onClick={() => navigate(`/resume/${resume.id}/edit`)}
                  >
                    수정
                  </Button>
                )}
              </Flex>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
}
