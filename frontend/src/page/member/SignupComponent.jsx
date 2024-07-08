import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DaumPostcodeEmbed from "react-daum-postcode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const styles = {
  formControl: {
    display: "flex",
    marginBottom: "10px",
  },
  formLabel: {
    w: "110px",
    h: "20px",
    lineHeight: "20px",
    borderRight: "3px solid orange",
    my: "10px",
    textAlign: "left",
  },
  formControlHalf: {
    w: "50%",
    display: "flex",
  },
  input: {
    width: "70%",
    marginRight: 2,
  },

  box: {
    width: "110px",
    height: "20px",
    lineHeight: "20px",
    marginRight: "20px",
    borderRight: "3px solid orange",
  },
};

export function SignupComponent({ member, setMember, errors, setErrors }) {
  const [pwdShow, setPwdShow] = useState(false);
  const [pwdCheckShow, setPwdCheckShow] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [isSendMail, setIsSendMail] = useState(false);
  const [authNumber, setAuthNumber] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);

  const [seconds, setSeconds] = useState(120); // 1분 = 60초
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handlePwdClick = () => setPwdShow(!pwdShow);
  const handlePwdCheckClick = () => setPwdCheckShow(!pwdCheckShow);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const startCountdown = () => {
    setIsActive(true);
  };

  const handleInputChange = (prop) => (e) => {
    setMember({ ...member, [prop]: e.target.value });
  };

  const onCompletePost = (data) => {
    setMember({ ...member, address: data.address });
    onClose();
  };

  const isError = (prop) => prop !== undefined;

  const isPwdMatch = member.password === member.passwordCheck;

  function handleSignupBtn() {
    if (isMatch) {
      axios
        .post("/api/signup", member)
        .then(() => {
          toast({
            status: "success",
            description: "회원가입 성공",
            position: "top",
          });
          navigate("/login");
        })
        .catch((err) => {
          setErrors(null);
          setErrors(err.response.data);
        });
    } else {
      alert("인증 번호를 다시 확인해주세요.");
    }
  }

  function handleSendMailBtn() {
    alert("인증번호를 발신합니다. 최대 1분 소요됩니다.");
    if (isSendMail) {
      setSeconds(120);
    }
    startCountdown();
    setIsSendMail(true);
    setMember({ ...member, email: currentEmail });
    const email = new URLSearchParams();
    email.append("email", currentEmail);
    axios
      .post(`/api/mail-send`, email)
      .then((res) => {
        if (res.data === false) {
          alert("이미 존재하는 이메일입니다. 다시 확인해주세요.");
          setIsSendMail(false);
          setEmailCheck(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          alert("이메일 형식을 맞춰주세요.");
          setIsSendMail(false);
        }
      });
  }

  function handleAuthCheckBtn() {
    const params = new URLSearchParams();
    params.append("authNumber", authNumber);
    params.append("email", member.email);
    axios.post("/api/mail-check", params).then((res) => {
      setIsMatch(res.data);
      if (res.data === false) {
        alert("인증번호를 다시 확인해주세요.");
      }
    });
  }

  function handleEmailCheck() {
    axios
      .get("/api/only-mail-check", { params: { email: currentEmail } })
      .then((res) => {
        if (res.status === 200) {
          alert("회원가입 가능합니다.");
          setEmailCheck(true);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          alert(err.response.data);
          setEmailCheck(false);
        }
      });
  }

  return (
    <Box>
      <FormControl {...styles.formControl} isInvalid={isError(errors.email)}>
        <FormLabel {...styles.formLabel}>이메일</FormLabel>
        <Box w={"70%"}>
          <Box>
            <InputGroup>
              <Input
                disabled={isMatch}
                onChange={(e) => setCurrentEmail(e.target.value)}
                placeholder={"이메일을 입력해주세요."}
                defaultValue={currentEmail}
              />
              {!emailCheck && (
                <InputRightElement w={"100px"} mr={"10px"}>
                  <Button
                    border={"1px solid black"}
                    h="1.75rem"
                    size="sm"
                    onClick={handleEmailCheck}
                  >
                    중복 확인
                  </Button>
                </InputRightElement>
              )}
              {emailCheck && (
                <InputRightElement w={"100px"} mr={"10px"}>
                  <Button
                    border={"1px solid black"}
                    isDisabled={isMatch}
                    h="1.75rem"
                    size="sm"
                    onClick={handleSendMailBtn}
                  >
                    {isSendMail ? "재발송" : "인증번호 발송"}
                  </Button>
                </InputRightElement>
              )}
            </InputGroup>
            {errors && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </Box>
          {isSendMail && (
            <Flex w={"80%"} mt={"10px"}>
              <InputGroup w={"80%"}>
                <Input
                  disabled={isMatch}
                  onChange={(e) => setAuthNumber(e.target.value)}
                  placeholder={"인증번호를 입력해주세요."}
                />
                <InputRightElement mr={"10px"}>
                  <Button
                    border={"1px solid black"}
                    isDisabled={isMatch}
                    h="1.75rem"
                    size="sm"
                    onClick={handleAuthCheckBtn}
                  >
                    확인
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Spacer />
              <Box w={"70px"} lineHeight={"40px"}>
                <Text color={"gray.500"}>{seconds}</Text>
              </Box>
            </Flex>
          )}
        </Box>
      </FormControl>
      <Box pl={"130px"} fontSize={"14px"}>
        숫자, 문자, 특수문자 무조건 1개 이상, 비밀번호 최소 8자에서 최대
        16자까지 허용합니다.
      </Box>
      <FormControl
        {...styles.formControl}
        isInvalid={isError(errors.password) || !isPwdMatch}
      >
        <FormLabel {...styles.formLabel}>비밀번호</FormLabel>
        <Box w={"70%"}>
          <InputGroup>
            <Input
              type={pwdShow ? "text" : "password"}
              onChange={handleInputChange("password")}
              placeholder={"비밀번호를 입력해주세요."}
              defaultValue={member.password}
            />
            <InputRightElement mr={"10px"}>
              <Button h="1.75rem" size="sm" onClick={handlePwdClick}>
                {pwdShow ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors && <FormErrorMessage>{errors.password}</FormErrorMessage>}
        </Box>
      </FormControl>
      <FormControl
        {...styles.formControl}
        isInvalid={isError(errors.passwordCheck) || !isPwdMatch}
      >
        <FormLabel {...styles.formLabel}>비밀번호 확인</FormLabel>
        <Box w={"70%"}>
          <InputGroup>
            <Input
              type={pwdCheckShow ? "text" : "password"}
              onChange={handleInputChange("passwordCheck")}
              placeholder={"비밀번호 확인을 입력해주세요."}
              defaultValue={member.passwordCheck}
            />
            <InputRightElement mr={"10px"}>
              <Button h="1.75rem" size="sm" onClick={handlePwdCheckClick}>
                {pwdCheckShow ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors && (
            <FormErrorMessage>{errors.passwordCheck}</FormErrorMessage>
          )}
          {isPwdMatch || (
            <FormErrorMessage>
              비밀번호와 비밀번호 확인이 일치하지 않습니다.
            </FormErrorMessage>
          )}
        </Box>
      </FormControl>

      <Flex mb={"10px"}>
        <FormControl
          {...styles.formControlHalf}
          isInvalid={isError(errors.name)}
        >
          <FormLabel {...styles.formLabel}>이름</FormLabel>
          <Box>
            <Input
              onChange={handleInputChange("name")}
              w={"200px"}
              placeholder={"예) 홍길동"}
            />
            {errors && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </Box>
        </FormControl>

        <FormControl {...styles.formControlHalf}>
          <Flex h={"40px"} py={"10px"}>
            <FormLabel {...styles.box}>성별</FormLabel>
            <RadioGroup value={member.gender}>
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
          </Flex>
        </FormControl>
      </Flex>

      <Flex>
        <FormControl
          {...styles.formControl}
          isInvalid={isError(errors.birthDate)}
        >
          <FormLabel {...styles.formLabel}>생년월일</FormLabel>
          <Box>
            <Input
              w={"200px"}
              type={"number"}
              onChange={handleInputChange("birthDate")}
              placeholder={"예) 990101"}
            />
            {errors && <FormErrorMessage>{errors.birthDate}</FormErrorMessage>}
          </Box>
        </FormControl>
        <FormControl {...styles.formControl} isInvalid={isError(errors.phone)}>
          <FormLabel {...styles.formLabel}>전화번호</FormLabel>
          <Box>
            <Input
              maxLength={11}
              type={"tel"}
              w={"200px"}
              onChange={handleInputChange("phone")}
              placeholder={"예) 01012345678"}
            />
            {errors && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
          </Box>
        </FormControl>
      </Flex>

      <FormControl {...styles.formControl} isInvalid={isError(errors.address)}>
        <FormLabel {...styles.formLabel}>주소</FormLabel>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <DaumPostcodeEmbed onComplete={onCompletePost} />
          </ModalContent>
        </Modal>
        <Flex mb={2}>
          <Box w={"70%"} mr={2}>
            <Input defaultValue={member.address} readOnly />
            {errors && <FormErrorMessage>{errors.address}</FormErrorMessage>}
          </Box>
          <Button onClick={onOpen}>우편번호 검색</Button>
        </Flex>
      </FormControl>
      <Center mt={"30px"}>
        <Button
          w={"150px"}
          onClick={handleSignupBtn}
          colorScheme={"orange"}
          isDisabled={!isMatch}
        >
          회원가입
        </Button>
      </Center>
    </Box>
  );
}
