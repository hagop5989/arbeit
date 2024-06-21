import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function ResumeRegister() {
  const [member, setMember] = useState(null);
  const [resume, setResume] = useState({});
  const [errors, setErrors] = useState({});
  const [nowAge, setNowAge] = useState("");
  const [isRookie, setIsRookie] = useState(0);
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (account.id !== "") {
      axios.get(`/api/member/${account.id}`).then((res) => {
        setMember(res.data);
      });
      setResume({ ...resume, isRookie });
    }
  }, [account.id]);

  useEffect(() => {
    if (member) {
      countNowAge();
    }
  }, [member]);

  if (member == null) {
    return <Spinner />;
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
        navigate("/");
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

  return (
    <Box w="full" maxW="70%" mx="auto" p={5} lineHeight="30px">
      <Heading mb={"10px"} p={1}>
        이력서 생성
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box>
        <FormControl>
          <Box w="full" gap={"15px"} display={"flex"} flexDirection={"column"}>
            <Box display={"flex"}>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  이름
                </FormLabel>
                <Text h={"50px"}>{member.name}</Text>
              </Box>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  성별
                </FormLabel>
                <Text>{member.gender}</Text>
              </Box>
            </Box>

            <Flex mb={4}>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  생년월일{" "}
                </FormLabel>
                <Text>
                  {member.birthDate} (만 {nowAge}세)
                </Text>
              </Box>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  전화번호
                </FormLabel>
                <Text>{member.phone}</Text>
              </Box>
            </Flex>

            <Flex gap={"10px"} mb={4}>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  이메일
                </FormLabel>

                <Text>{member.email}</Text>
              </Box>
            </Flex>
            <Box mb={4}>
              <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"} mt={8}>
                제목
              </FormLabel>
              <Input
                placeholder="제목을 입력해주세요."
                onChange={handleInputChange("title")}
                h={"50px"}
                mb={4}
              />
              {errors && (
                <FormHelperText color="red.500">{errors.title}</FormHelperText>
              )}
            </Box>
            <Box mb={4}>
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
            </Box>
            <Box>
              <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
                자기 소개
              </FormLabel>
              <Textarea
                placeholder="자기소개를 써주세요."
                onChange={handleInputChange("content")}
                mb={4}
                h={"150px"}
              />
              {errors && (
                <FormHelperText color="red.500">
                  {errors.content}
                </FormHelperText>
              )}

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
        </FormControl>
      </Box>
    </Box>
  );
}
