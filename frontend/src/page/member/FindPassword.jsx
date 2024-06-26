import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function FindPassword() {
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [authNumber, setAuthNumber] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [isSendMail, setIsSendMail] = useState(false);
  const [seconds, setSeconds] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [pwdShow, setPwdShow] = useState(false);
  const [pwdCheckShow, setPwdCheckShow] = useState(false);

  const handlePwdClick = () => setPwdShow(!pwdShow);
  const handlePwdCheckClick = () => setPwdCheckShow(!pwdCheckShow);

  const navigate = useNavigate();

  const isMatchPwd = password === passwordCheck;

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

  function handleAuthCheckBtn() {
    const params = new URLSearchParams();
    params.append("authNumber", authNumber);
    params.append("email", currentEmail);
    axios.post("/api/mail-check", params).then((res) => {
      setIsMatch(res.data);
      if (res.data === false) {
        alert("인증번호를 다시 확인해주세요.");
      }
    });
  }

  function handleSendMailBtn() {
    axios.get();
    alert("인증번호를 발신합니다. 최대 1분 소요됩니다.");
    if (isSendMail) {
      setSeconds(120);
    }
    startCountdown();
    setIsSendMail(true);
    setCurrentEmail(email);
    const param = new URLSearchParams();
    param.append("email", email);
    axios
      .post(`/api/auth-email`, param)
      .then((res) => {
        if (res.data === false) {
          alert("일치하는 정보가 없습니다.");
          setIsSendMail(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          alert("이메일 형식을 맞춰주세요.");
          setIsSendMail(false);
        }
      });
  }

  function handleEditPasswordBtn() {
    if (isMatchPwd) {
      const params = new URLSearchParams();
      params.append("password", password);
      params.append("passwordCheck", passwordCheck);
      params.append("email", currentEmail);
      axios
        .post("/api/password-update", params)
        .then(() => {
          alert("비밀번호가 정상 변경되었습니다.");
          navigate("/login");
        })
        .catch((err) => {
          if (err.response.status === 400) {
            alert("형식에 맞춰주세요.");
          }
        });
    }
  }

  return (
    <Box>
      <Flex w={"100%"} h={"100%"}>
        <Box w={"70%"}>
          <FormControl my={"5px"}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color={"gray.400"}>
                <FontAwesomeIcon icon={faEnvelope} />
              </InputLeftElement>
              <Input
                disabled={isMatch}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
              />
            </InputGroup>
          </FormControl>
        </Box>
        <Box w={"30%"} ml={3} pt={"5px"}>
          <Button
            isDisabled={isMatch}
            w={"100%"}
            h={"100%"}
            colorScheme={"orange"}
            onClick={handleSendMailBtn}
          >
            인증번호 발송
          </Button>
        </Box>
      </Flex>
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
            {isMatch || <Text color={"gray.500"}>{seconds}</Text>}
          </Box>
        </Flex>
      )}
      {isMatch && (
        <>
          <Center height={"40px"} my={"30px"} borderY={"2px solid gray"}>
            비밀번호 변경
          </Center>
          <Box>
            <Box w={"100%"}>
              <Box fontSize={"13px"}>
                숫자, 문자, 특수문자 무조건 1개 이상, 비밀번호 최소 8자에서 최대
                16자까지 허용합니다.
              </Box>
              <FormControl my={"5px"}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color={"gray.400"}>
                    <FontAwesomeIcon icon={faKey} />
                  </InputLeftElement>
                  <Input
                    type={pwdShow ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handlePwdClick}>
                      {pwdShow ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
            <Box w={"100%"}>
              <FormControl my={"5px"}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color={"gray.400"}>
                    <FontAwesomeIcon icon={faKey} />
                  </InputLeftElement>
                  <Input
                    type={pwdCheckShow ? "text" : "password"}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    placeholder="비밀번호 확인"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handlePwdCheckClick}>
                      {pwdCheckShow ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
            <Center mt={"20px"}>
              <Button
                colorScheme={"orange"}
                onClick={handleEditPasswordBtn}
                isDisabled={!isMatchPwd}
              >
                비밀번호 변경
              </Button>
            </Center>
          </Box>
        </>
      )}
    </Box>
  );
}
