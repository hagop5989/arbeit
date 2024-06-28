import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export function MemberEdit() {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [member, setMember] = useState(null);
  const [show, setShow] = useState(false);
  const [pwdCheck, setPwdCheck] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const handleClick = () => setShow(!show);
  const handlePwdCheckClick = () => setPwdCheck(!pwdCheck);

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => setMember(res.data))
      .catch(() => navigate("/"));
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
          회원정보 수정
        </Heading>
        <Divider mb={"40px"} borderWidth={"2px"} />
        <Box>
          <Box>
            <Box mb={4}>
              <FormControl isInvalid={isError(errors.password)}>
                <Flex>
                  <FormLabel fontSize={"xl"}>패스워드</FormLabel>
                  <Center fontSize={"14px"} pb={"5px"}>
                    숫자, 문자, 특수문자 무조건 1개 이상, 비밀번호 최소 8자에서
                    최대 16자까지 허용합니다.
                  </Center>
                </Flex>
                <InputGroup>
                  <Input
                    type={show ? "text" : "password"}
                    onChange={handleInputChange("password")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors && (
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <FormControl isInvalid={isError(errors.passwordCheck)}>
              <Box mb={4}>
                <FormLabel fontSize={"xl"}>패스워드 확인</FormLabel>
                <InputGroup>
                  <Input
                    type={pwdCheck ? "text" : "password"}
                    onChange={handleInputChange("passwordCheck")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handlePwdCheckClick}>
                      {pwdCheck ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors && (
                  <FormErrorMessage color="red.500">
                    {errors.passwordCheck}
                  </FormErrorMessage>
                )}
              </Box>
            </FormControl>

            <Flex gap={"10px"} mb={4}>
              <FormControl isInvalid={isError(errors.name)}>
                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>이름</FormLabel>
                  <Input
                    defaultValue={member.name}
                    onChange={handleInputChange("name")}
                  />
                  {errors && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                </Box>
              </FormControl>
              <FormControl isInvalid={isError(errors.phone)}>
                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>전화번호</FormLabel>
                  <Input
                    defaultValue={member.phone}
                    onChange={handleInputChange("phone")}
                  />
                  {errors && (
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  )}
                </Box>
              </FormControl>
            </Flex>

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
                    readOnly
                  />
                  {errors && (
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  )}
                </Box>
                <Button onClick={onOpen}>우편번호 검색</Button>
              </Flex>
            </FormControl>
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
