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
      .then((res) => setMember(res.data))
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

  function handleRemoveBtn() {
    axios
      .delete(`/api/member/${id}`)
      .then(() => {
        toast({
          status: "success",
          description: "삭제되었습니다.",
          position: "top",
        });
      })
      .catch()
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
              <FormLabel>사진</FormLabel>
              <Image
                w={"240px"}
                h={"240px"}
                border={"1px solid gray"}
                borderRadius={150}
                src={
                  profileSrc === ""
                    ? "https://contents.albamon.kr/monimg/msa/assets/images/icon_profile_male80.svg"
                    : profileSrc
                }
              />
              {account.hasAccess(id) && (
                <Box>
                  <Center
                    boxSize={"50px"}
                    bgColor="gray.100"
                    borderRadius={100}
                    mt={"-30px"}
                    cursor="pointer"
                    onClick={handleProfilePictureBtn}
                  >
                    <FontAwesomeIcon icon={faCamera} fontSize={"25px"} />
                  </Center>
                  <Input
                    type={"file"}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Box>
              )}
            </FormControl>
            {/* 회원 정보 */}
            <FormControl>
              <Box w={"100%"} mb={4}>
                <FormLabel fontSize={"xl"}>이메일</FormLabel>
                <Input defaultValue={member.email} readOnly />
              </Box>
              <Flex gap={"10px"} mb={4}>
                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>이름</FormLabel>
                  <Input defaultValue={member.name} readOnly />
                </Box>

                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>생년월일</FormLabel>
                  <Input defaultValue={member.birthDate} readOnly />
                </Box>
              </Flex>
              <Box w={"100%"} mb={4}>
                <FormLabel fontSize={"xl"}>주소</FormLabel>
                <Input defaultValue={member.address} readOnly />
              </Box>

              <Flex gap={"10px"} mb={4}>
                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>성별</FormLabel>
                  <Input defaultValue={member.gender} readOnly />
                </Box>
                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>전화번호</FormLabel>
                  <Input
                    defaultValue={formatPhoneNumber(member.phone)}
                    readOnly
                  />
                </Box>
              </Flex>

              <Box my={8}>
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
                      회원 삭제
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
