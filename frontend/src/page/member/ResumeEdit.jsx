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
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function ResumeEdit() {
  const { id } = useParams();
  const [resume, setResume] = useState({});
  const [errors, setErrors] = useState({});
  const [nowAge, setNowAge] = useState("");
  const initialIndex = resume.isRookie === 1 ? 0 : 1;

  const navigate = useNavigate();
  const toast = useToast();

  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/resume/${id}`)
      .then((res) => {
        setResume(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404 || err.response.status === 403) {
          toast({
            status: "warning",
            description: "접근 권한이 없습니다.",
            position: "top",
          });
          navigate("/resume/list");
        }
      });
  }, []);

  useEffect(() => {
    if (resume) {
      countNowAge();
    }
  }, [resume]);

  function handleRookieBtn(prop) {
    setResume({ ...resume, isRookie: prop });
  }

  const handleInputChange = (prop) => (e) => {
    setResume({ ...resume, [prop]: e.target.value });
  };

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

  // Update
  function handleSaveBtn() {
    axios
      .put(`/api/resume/${id}`, resume)
      .then(() => {
        toast({
          status: "success",
          description: "수정 완료",
          position: "top",
        });
        navigate(`/resume/${id}`);
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  }

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

  return (
    <Box w="full" maxW="70%" mx="auto" p={5} lineHeight="30px">
      <Heading mb={"10px"} p={1}>
        이력서 수정
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
                <Text h={"50px"}>{account.name}</Text>
              </Box>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  성별
                </FormLabel>
                <Text>{resume.gender}</Text>
              </Box>
            </Box>

            <Flex mb={4}>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  생년월일{" "}
                </FormLabel>
                <Text>
                  {resume.birthDate} (만 {nowAge}세)
                </Text>
              </Box>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  전화번호
                </FormLabel>
                <Text>{resume.phone}</Text>
              </Box>
            </Flex>

            <Flex gap={"10px"} mb={4}>
              <Box w={"50%"} display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  이메일
                </FormLabel>
                <Text>{resume.email}</Text>
              </Box>
            </Flex>
            <Box mb={4}>
              <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"} mt={8}>
                제목
              </FormLabel>
              <Input
                placeholder="제목을 입력해주세요."
                defaultValue={resume.title}
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
              <Tabs variant="solid-rounded" index={initialIndex}>
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
                defaultValue={resume.content}
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
                onClick={handleSaveBtn}
                bgColor={"#FF7F3E"}
                color={"white"}
                w="full"
                h={"50px"}
              >
                이력서 수정
              </Button>
            </Box>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
}
