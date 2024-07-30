import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Switch,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

export function Login() {
  const [authority, setAuthority] = useState("ALBA");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);

  const account = useContext(LoginContext);

  function encodePw() {
    axios.post("/api/member/encode", { email, password }).then(() => {
      alert("성공");
    });
  }

  function handleLoginBtn() {
    axios
      .post(`/api/token`, { email, password, authority })
      .then((res) => {
        account.login(res.data.token);
        navigate("/");
        toast({
          status: "success",
          description: "로그인 완료",
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          alert("아이디와 비밀번호를 확인해주세요.");
        } else if (err.response.status === 404) {
          alert("일치하는 정보가 없습니다.");
        }
        setErrors(err.response.data);
      })
      .finally();
  }

  function handleSwitchChange() {
    if (isAdmin === true) {
      setIsAdmin(false);
      setAuthority("BOSS");
    } else {
      setIsAdmin(true);
      setAuthority("ADMIN");
    }
  }

  const isError = (prop) => prop !== undefined;

  function handleAuthTab(auth) {
    setAuthority(auth);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleLoginBtn();
    }
  }

  return (
    <Box w={"500px"} h={"500px"}>
      <Helmet>
        <title>로그인 - 알바커넥터</title>
      </Helmet>
      <Box
        h={"60px"}
        mb={"30px"}
        bgGradient="linear(to-r, orange.500, orange.300)"
        color={"white"}
        borderTopRadius={"10px"}
      >
        <Heading
          size={"lg"}
          textAlign={"center"}
          lineHeight={"60px"}
          fontFamily={"SBAggroB"}
        >
          로그인
        </Heading>
      </Box>
      <Box>
        <Tabs isFitted position="relative" variant="unstyled">
          <TabList>
            <Tab onClick={() => handleAuthTab("ALBA")}>알바</Tab>
            <Tab onClick={() => handleAuthTab("BOSS")}>기업</Tab>
          </TabList>
          <TabIndicator mt="-1.5px" height="2px" bg="#FF7F3E" />
          <TabPanels>
            <TabPanel display={"flex"}>
              <Box w={"350px"} h={"100%"}>
                <FormControl isInvalid={isError(errors.email)} mt={"20px"}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color={"gray.400"}>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </InputLeftElement>
                    <Input
                      defaultValue={email}
                      type="email"
                      placeholder="이메일"
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl isInvalid={isError(errors.password)} mt={"5px"}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color={"gray.400"}>
                      <FontAwesomeIcon icon={faKey} />
                    </InputLeftElement>
                    <Input
                      defaultValue={password}
                      type={show ? "text" : "password"}
                      placeholder="비밀번호"
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyPress}
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
                </FormControl>
              </Box>
              <Box ml={3} mt={"19px"}>
                <Button
                  w={"100px"}
                  h={"89px"}
                  onClick={handleLoginBtn}
                  colorScheme={"orange"}
                >
                  로그인
                </Button>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <FormControl display="flex" alignItems="center" mb="15px">
                  <FormLabel
                    htmlFor="isAdmin"
                    mb={"0"}
                    color={isAdmin ? "black" : "gray"}
                  >
                    관리자입니까?
                  </FormLabel>
                  <Switch
                    id="isAdmin"
                    onChange={handleSwitchChange}
                    isChecked={isAdmin}
                  />
                </FormControl>
                <Flex>
                  <Box w={"350px"} h={"100%"}>
                    <FormControl isInvalid={isError(errors.email)} mt={"20px"}>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          color={"gray.400"}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputLeftElement>
                        <Input
                          defaultValue={email}
                          type="email"
                          placeholder="이메일"
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={handleKeyPress}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl
                      isInvalid={isError(errors.password)}
                      mt={"5px"}
                    >
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          color={"gray.400"}
                        >
                          <FontAwesomeIcon icon={faKey} />
                        </InputLeftElement>
                        <Input
                          defaultValue={password}
                          type={show ? "text" : "password"}
                          placeholder="비밀번호"
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={handleKeyPress}
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
                    </FormControl>
                  </Box>
                  <Box ml={3} mt={"19px"}>
                    <Button
                      w={"100px"}
                      h={"89px"}
                      onClick={handleLoginBtn}
                      colorScheme={"orange"}
                    >
                      로그인
                    </Button>
                  </Box>
                </Flex>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Box mt={"20px"} ml={"20px"} color={"gray.600"}>
          <Link href={"/find-member"} mr={"30px"} color={"red.300"}>
            이메일 또는 비밀번호를 잊어버리셨나요?
          </Link>
          <Link href={"/signup"}>회원가입</Link>
        </Box>
        {/* 테스트용 코드*/}
        {/*<Button onClick={encodePw}>비밀번호 인코딩</Button>*/}
      </Box>
    </Box>
  );
}
