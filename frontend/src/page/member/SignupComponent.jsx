import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DaumPostcodeEmbed from "react-daum-postcode";

const styles = {
  formControl: {
    marginBottom: "60px",
    height: "100px",
  },
  formLabel: {
    fontSize: "25px",
    width: "100%",
    borderBottom: "2px solid #1F3042",
    marginBottom: 6,
  },
  center: {
    width: "97%",
    margin: "auto",
    display: "block",
  },
};
export function SignupComponent({ member, setMember, errors, setErrors }) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  let navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleInputChange = (prop) => (e) => {
    setMember({ ...member, [prop]: e.target.value });
  };

  function handleSignupBtn() {
    axios
      .post("/api/signup", member)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        setErrors(null);
        setErrors(err.response.data);
      })
      .finally();
  }

  const onCompletePost = (data) => {
    setMember({ ...member, address: data.address });
    onClose();
  };

  return (
    <Box>
      {/*===========================*/}
      <FormControl>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color={"gray.400"}>
            <FontAwesomeIcon icon={faEnvelope} />
          </InputLeftElement>
          <Input
            defaultValue={member.email}
            type="email"
            placeholder="이메일"
            onChange={handleInputChange("email")}
          />
          {errors && <FormHelperText>{errors.email}</FormHelperText>}
        </InputGroup>
      </FormControl>
      <FormControl>
        <InputGroup>
          <InputLeftElement color={"gray.400"}>
            <FontAwesomeIcon icon={faKey} />
          </InputLeftElement>
          <Input type={show ? "text" : "password"} placeholder="패스워드" />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {errors && <FormHelperText>{errors.password}</FormHelperText>}
      </FormControl>

      <Flex border={"1px solid red"}>
        <FormControl w={"240px"} border={"1px solid black"} display={"flex"}>
          <FormLabel
            w={"40px"}
            h={"20px"}
            lineHeight={"20px"}
            borderRight={"3px solid orange"}
            my={"10px"}
          >
            이름
          </FormLabel>
          <Input w={"200px"} onChange={handleInputChange("name")} />
          {errors && <FormHelperText>{errors.name}</FormHelperText>}
        </FormControl>
        <FormControl
          w={"200px"}
          h={"40px"}
          border={"1px solid red"}
          ml={"30px"}
        >
          <Center h={"40px"}>
            <Box
              w={"40px"}
              h={"20px"}
              lineHeight={"20px"}
              mr={"20px"}
              borderRight={"3px solid orange"}
            >
              성별
            </Box>
            <RadioGroup defaultValue="2">
              <Stack spacing={5} direction="row">
                <Radio
                  colorScheme="orange"
                  value="MALE"
                  onChange={handleInputChange("gender")}
                >
                  남자
                </Radio>
                <Radio
                  colorScheme="orange"
                  value="FEMALE"
                  onChange={handleInputChange("gender")}
                >
                  여자
                </Radio>
              </Stack>
            </RadioGroup>
          </Center>
        </FormControl>
      </Flex>
      <Flex border={"1px solid green"}>
        <FormControl display={"flex"} border={"1px solid orange"}>
          <FormLabel
            w={"70px"}
            h={"20px"}
            lineHeight={"20px"}
            borderRight={"3px solid orange"}
            my={"10px"}
          >
            생년월일
          </FormLabel>
          <Input
            w={"200px"}
            type={"text"}
            onChange={handleInputChange("birthDate")}
            placeholder={"990101"}
          />
          {errors && <FormHelperText>{errors.birthDate}</FormHelperText>}
        </FormControl>
        <FormControl display={"flex"} border={"1px solid blue"}>
          <FormLabel
            w={"70px"}
            h={"20px"}
            lineHeight={"20px"}
            borderRight={"3px solid orange"}
            my={"10px"}
          >
            전화번호
          </FormLabel>
          <Input w={"200px"} onChange={handleInputChange("phone")} />
          {errors && <FormHelperText>{errors.phone}</FormHelperText>}
        </FormControl>
      </Flex>
      <FormControl display={"flex"}>
        <FormLabel
          w={"40px"}
          h={"20px"}
          lineHeight={"20px"}
          borderRight={"3px solid orange"}
          my={"10px"}
        >
          주소
        </FormLabel>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <DaumPostcodeEmbed onComplete={onCompletePost} />
          </ModalContent>
        </Modal>
        <Flex mb={2}>
          <Input w={"70%"} defaultValue={member.address} readOnly mr={2} />
          <Button onClick={onOpen}>우편번호 검색</Button>
        </Flex>
        {errors && <FormHelperText>{errors.address}</FormHelperText>}
      </FormControl>

      <Button onClick={handleSignupBtn}>회원가입</Button>
    </Box>
  );
}
