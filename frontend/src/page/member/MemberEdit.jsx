import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import DaumPostcodeEmbed from "react-daum-postcode";

export function MemberEdit() {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [member, setMember] = useState(null);
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => setMember(res.data))
      .catch()
      .finally();
  }, []);

  function handleSaveBtn() {
    axios
      .put(`/api/member/${id}`, member)
      .then(() => {
        navigate(`/member/${member.id}`);
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally();
  }

  const handleInputChange = (prop) => (e) => {
    setMember({ ...member, [prop]: e.target.value });
  };

  const onCompletePost = (data) => {
    setMember({ ...member, address: data.address });
    onClose();
  };

  const isError = (prop) => prop !== undefined;

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Box>
        <Heading mb={"10px"} p={1}>
          회원정보
        </Heading>
        <Divider mb={"40px"} borderWidth={"2px"} />
        <Box>
          <Box>
            <FormControl>
              <Box mb={4}>
                <FormLabel fontSize={"xl"}>이메일</FormLabel>
                <Input value={member.email} isReadOnly />
              </Box>

              <Box mb={4}>
                <FormLabel fontSize={"xl"}>패스워드</FormLabel>
                <Input
                  defaultValue={""}
                  onChange={handleInputChange("password")}
                />
                {errors && (
                  <FormHelperText color="red.500">
                    {errors.password}
                  </FormHelperText>
                )}
              </Box>
              <Box fontSize={"14px"} mb={4}>
                숫자, 문자, 특수문자 무조건 1개 이상, 비밀번호 최소 8자에서 최대
                16자까지 허용합니다.
              </Box>

              <Box mb={4}>
                <FormLabel fontSize={"xl"}>패스워드 확인</FormLabel>
                <Input
                  defaultValue={""}
                  onChange={handleInputChange("passwordCheck")}
                />
                {errors && (
                  <FormHelperText color="red.500">
                    {errors.passwordCheck}
                  </FormHelperText>
                )}
              </Box>

              <Flex gap={"10px"} mb={4}>
                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>이름</FormLabel>
                  <Input
                    value={member.name}
                    onChange={handleInputChange("name")}
                  />
                  {errors && (
                    <FormHelperText color="red.500">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Box>

                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>전화번호</FormLabel>
                  <Input
                    value={member.phone}
                    onChange={handleInputChange("phone")}
                  />
                  {errors && (
                    <FormHelperText color="red.500">
                      {errors.phone}
                    </FormHelperText>
                  )}
                </Box>
              </Flex>

              {/* 주소 */}
              <FormControl isInvalid={isError(errors.address)} mb={8}>
                <FormLabel> 주소</FormLabel>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <DaumPostcodeEmbed onComplete={onCompletePost} />
                  </ModalContent>
                </Modal>
                <Flex mb={2}>
                  <Box w={"70%"} mr={2}>
                    <Input
                      value={member.address}
                      onChange={handleInputChange("address")}
                    />
                    {errors && (
                      <FormErrorMessage>{errors.address}</FormErrorMessage>
                    )}
                  </Box>
                  <Button onClick={onOpen}>우편번호 검색</Button>
                </Flex>
              </FormControl>
              {/* 주소 */}

              <Flex gap={"10px"} my={"20px"}>
                <Button
                  onClick={handleSaveBtn}
                  w={"50%"}
                  bgColor={"#FF7F3E"}
                  color={"white"}
                >
                  저장
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/member/${id}`);
                  }}
                  w={"50%"}
                  bgColor={"gray.500"}
                  color={"white"}
                >
                  취소
                </Button>
              </Flex>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
