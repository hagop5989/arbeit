import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export function MemberInfo() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [profileSrc, setProfileSrc] = useState("");
  const [nowAge, setNowAge] = useState("");
  const fileInputRef = useRef({});
  const navigate = useNavigate();
  const toast = useToast();

  const account = useContext(LoginContext);

  function getProfilePicture() {
    axios
      .get(`/api/profile/${id}`)
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

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        setMember(res.data);
        if (member != null) {
          setNowAge(res.data);
        }
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "접근 권한이 없습니다.",
          position: "top",
        });
        navigate("/member/list");
      })
      .finally();
    getProfilePicture();
  }, []);

  useEffect(() => {
    if (member) {
      countNowAge();
    }
  }, [member]);

  function handleRemoveBtn() {
    axios
      .post(`/api/member/${id}/delete`)
      .then(() => {
        toast({
          status: "warning",
          description: "탈퇴되었습니다.",
          position: "top",
        });
        account.logout();
        navigate("/login");
      })
      .catch(() => alert("내부 오류 발생"))
      .finally();
  }

  if (member === null) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function handleProfilePictureBtn() {
    fileInputRef.current.click();
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    axios.postForm("/api/profile/register", { files, id }).then(() => {
      getProfilePicture();
    });
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
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Box>
        <Heading mb={"10px"} p={1}>
          회원정보
        </Heading>
        <Divider mb={"40px"} borderWidth={"2px"} />
        <Box>
          <Box>
            {/* 프로필 사진 */}
            <FormControl>
              <Flex>
                <Box w={"240px"} h={"240px"}>
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
                  {account.hasAccess(id) && (
                    <Box w={"50px"} h={"50px"}>
                      <Center
                        boxSize={"50px"}
                        bgColor="gray.100"
                        borderRadius={100}
                        ml={"20px"}
                        mt={"-30px"}
                        cursor="pointer"
                        onClick={handleProfilePictureBtn}
                      >
                        <FontAwesomeIcon icon={faCamera} fontSize={"25px"} />
                      </Center>
                      <Input
                        w={"50px"}
                        type={"file"}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </Box>
                  )}
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
                    <Box>{member.name}</Box>
                  </Box>

                  <Box display={"flex"}>
                    <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                      생년월일
                    </FormLabel>
                    <Box>{member.birthDate}</Box>
                    <Box ml={"5px"}> (만 {nowAge}세)</Box>
                  </Box>

                  <Box display={"flex"}>
                    <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                      성별
                    </FormLabel>
                    <Box>{member.gender}</Box>
                  </Box>

                  <Box display={"flex"}>
                    <FormLabel w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                      전화번호
                    </FormLabel>
                    <Box>{formatPhoneNumber(member.phone)}</Box>
                  </Box>
                </Box>
              </Flex>
            </FormControl>
            {/* 회원 정보 */}
            <FormControl>
              <Box w={"100%"} my={5}>
                <FormLabel fontSize={"xl"}>이메일</FormLabel>
                <Input defaultValue={member.email} readOnly />
              </Box>
              <Box w={"100%"} mb={4}>
                <FormLabel fontSize={"xl"}>주소</FormLabel>
                <Input defaultValue={member.address} readOnly />
              </Box>

              <Box my={10}>
                {account.hasAccess(id) && (
                  <Flex gap={"10px"} my={"20px"}>
                    <Button
                      w={"50%"}
                      bgColor={"#FF7F3E"}
                      color={"white"}
                      onClick={() => navigate(`/member/${id}/edit`)}
                    >
                      회원 수정
                    </Button>
                    <Button
                      w={"50%"}
                      bgColor={"red.500"}
                      color={"white"}
                      onClick={handleRemoveBtn}
                    >
                      회원 탈퇴
                    </Button>
                  </Flex>
                )}
              </Box>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
