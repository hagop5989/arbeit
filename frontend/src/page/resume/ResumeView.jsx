import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Image,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function ResumeView() {
  const { id } = useParams();
  const [resume, setResume] = useState({});
  const [profileSrc, setProfileSrc] = useState("");
  const initialIndex = resume.isRookie === 1 ? 0 : 1;
  const toast = useToast();
  const navigate = useNavigate();

  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/resume/${id}`)
      .then((res) => {
        setResume(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          navigate("/resume/list");
        }
      });
    if (resume.memberId !== undefined) {
      getProfilePicture();
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
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Box>
        <Heading mb={"10px"} p={1}>
          이력서 세부항목
        </Heading>
        <Divider mb={"40px"} borderWidth={"2px"} />
        <Box w="full" gap={"20px"} display={"flex"} flexDirection={"column"}>
          <Flex>
            <Box w={"240px"} h={"240px"}>
              <Image
                w={"100%"}
                h={"100%"}
                border={"1px solid gray"}
                borderRadius={"50%"}
                src={
                  profileSrc === "" ? "/public/base_profile.png" : profileSrc
                }
                objectFit={"contain"}
              />
            </Box>
            <Box
              w={"50%"}
              ml={"50px"}
              display={"flex"}
              flexDirection={"column"}
              gap={"25px"}
              lineHeight={"30px"}
            >
              <Box display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  이름
                </FormLabel>
                <Box>{account.name}</Box>
              </Box>

              <Box display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  생년월일
                </FormLabel>
                <Box>{resume.birthDate}</Box>
                {/*<Box ml={"5px"}> (만 {nowAge}세)</Box>*/}
              </Box>

              <Box display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  성별
                </FormLabel>
                <Box>{resume.gender}</Box>
              </Box>

              <Box display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  전화번호
                </FormLabel>
                <Box>{formatPhoneNumber(resume.phone)}</Box>
              </Box>

              <Box display={"flex"}>
                <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                  이메일
                </FormLabel>
                <Box>{resume.email}</Box>
              </Box>
            </Box>
          </Flex>

          <Box mb={4}>
            <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
              자기소개
            </FormLabel>
            <Textarea defaultValue={resume.content} h={"150px"} readOnly />
          </Box>

          <Box mb={4}>
            <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
              경력여부
            </FormLabel>
            <Tabs variant="solid-rounded" index={initialIndex}>
              <TabList>
                <Tab
                  w={"160px"}
                  h={"50px"}
                  border={"1px solid lightgray"}
                  onClick={(e) => e.preventDefault()} // 클릭 이벤트 무효화
                >
                  신입
                </Tab>
                <Tab
                  w={"160px"}
                  h={"50px"}
                  border={"1px solid lightgray"}
                  onClick={(e) => e.preventDefault()} // 클릭 이벤트 무효화
                >
                  경력
                </Tab>
              </TabList>
            </Tabs>
          </Box>

          <Box mb={4}>
            <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
              생성일
            </FormLabel>
            <Text>{resume.inserted}</Text>
          </Box>
          <Flex gap={"10px"}>
            <Button
              w={"50%"}
              bgColor={"gray.500"}
              color={"white"}
              onClick={handlePrevClick}
            >
              이전
            </Button>
            <Button
              w={"50%"}
              bgColor={"#FF7F3E"}
              color={"white"}
              onClick={() => navigate(`/resume/${resume.id}/edit`)}
            >
              수정
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
