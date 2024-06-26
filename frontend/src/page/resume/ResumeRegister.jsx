import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Tab,
  TabList,
  Tabs,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

const styles = {
  title: {
    w: "90px",
    fontSize: "md",
    fontWeight: "bold",
    mr: "20px",
  },
};

export function ResumeRegister() {
  const [member, setMember] = useState(null);
  const [resume, setResume] = useState({});
  const [errors, setErrors] = useState({});
  const [nowAge, setNowAge] = useState("");
  const [isRookie, setIsRookie] = useState(0);
  const [profileSrc, setProfileSrc] = useState("");
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();

  const isError = (prop) => prop !== undefined;

  useEffect(() => {
    axios
      .get("/api/only-alba")
      .then(() => {
        if (account.id !== "") {
          axios.get(`/api/member/${account.id}`).then((res) => {
            setMember(res.data);
          });
          setResume({ ...resume, isRookie });
          getProfilePicture();
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id]);

  useEffect(() => {
    if (member) {
      countNowAge();
    }
  }, [member]);

  function getProfilePicture() {
    axios
      .get(`/api/profile/${account.id}`)
      .then((res) => {
        setProfileSrc(res.data);
      })
      .catch(() =>
        toast({
          status: "error",
          description: "내부 오류 발생",
          position: "top",
        }),
      );
  }

  function handleRookieBtn(prop) {
    setIsRookie(prop);
    setResume({ ...resume, isRookie });
  }

  const handleInputChange = (prop) => (e) => {
    setResume({ ...resume, [prop]: e.target.value });
  };

  function handleWriteBtn() {
    axios
      .post("/api/resume/register", resume)
      .then(() => {
        toast({
          status: "success",
          description: "등록되었습니다.",
          position: "top",
        });
        navigate("/resume/list");
      })
      .catch((err) => {
        setErrors(err.response.data);
        if (err.response.status === 403) {
          toast({
            status: "warning",
            description: "이력서의 최대 갯수는 5개 입니다.",
            position: "top",
          });
          navigate("/resume/list");
        }
      });
  }

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

  // 나이 계산
  const countNowAge = () => {
    const currentTime = Date.now();
    const birthTime = new Date(member.birthDate).getTime();
    const ageInMilliseconds = currentTime - birthTime;
    const ageInYears = Math.floor(
      ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25),
    ); // 윤년을 고려하여 365.25로 나눔
    setNowAge(ageInYears);
  };

  if (member == null) {
    return <Spinner />;
  }

  return (
    <Box w="full" maxW="70%" mx="auto" p={5} lineHeight="30px">
      <Box
        h={"70px"}
        mb={"70px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={"10px"}
      >
        <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
          이력서 등록
        </Heading>
      </Box>
      <Center>
        <Box w={"150px"} h={"150px"}>
          <Image
            w={"100%"}
            h={"100%"}
            border={"1px solid gray"}
            borderRadius={"50%"}
            src={profileSrc === "" ? "/public/base_profile.png" : profileSrc}
            objectFit={"contain"}
          />
        </Box>
        <Box w={"50%"} ml={"50px"} lineHeight={"30px"} fontSize={"15px"}>
          <Box display={"flex"}>
            <Box {...styles.title}>이름</Box>
            <Box>{account.name}</Box>
          </Box>

          <Box display={"flex"}>
            <Box {...styles.title}>생년월일</Box>
            <Box>
              {member.birthDate} (만 {nowAge}세)
            </Box>
          </Box>

          <Box display={"flex"}>
            <Box {...styles.title}>성별</Box>
            <Box>{member.gender}</Box>
          </Box>

          <Box display={"flex"}>
            <Box {...styles.title}>연락처</Box>
            <Box>{formatPhoneNumber(member.phone)}</Box>
          </Box>

          <Box display={"flex"}>
            <Box {...styles.title}>이메일</Box>
            <Box>{member.email}</Box>
          </Box>
        </Box>
      </Center>
      <Box h={"3px"} bg={"#E0E0E0"} mt={"40px"} />
      <Box>
        <FormControl mb={4} isInvalid={isError(errors.title)}>
          <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"} mt={8}>
            제목
          </FormLabel>
          <Input
            placeholder="제목을 입력해주세요."
            onChange={handleInputChange("title")}
            h={"50px"}
          />
          {errors && <FormErrorMessage>{errors.title}</FormErrorMessage>}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel fontSize={"xl"} fontWeight={"bold"}>
            경력
          </FormLabel>
          <Tabs variant="solid-rounded">
            <TabList>
              <Tab
                onClick={() => handleRookieBtn(1)}
                w={"160px"}
                h={"50px"}
                border={"1px solid lightgray"}
              >
                신입
              </Tab>
              <Tab
                onClick={() => handleRookieBtn(0)}
                w={"160px"}
                h={"50px"}
                border={"1px solid lightgray"}
              >
                경력
              </Tab>
            </TabList>
          </Tabs>
        </FormControl>
        <FormControl mb={10} isInvalid={isError(errors.content)}>
          <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
            자기 소개
          </FormLabel>
          <Textarea
            placeholder="자기소개를 써주세요."
            onChange={handleInputChange("content")}
            h={"150px"}
          />
          {errors && (
            <FormErrorMessage color="red.500">
              {errors.content}
            </FormErrorMessage>
          )}
        </FormControl>
        <Button
          onClick={handleWriteBtn}
          bgColor={"#FF7F3E"}
          color={"white"}
          w="full"
          h={"50px"}
        >
          이력서 생성
        </Button>
      </Box>
    </Box>
  );
}
