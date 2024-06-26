import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

export function FindEmail() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function handleFindEmailBtn() {
    const memberInfo = new URLSearchParams();
    memberInfo.append("name", name);
    memberInfo.append("phone", phone);
    axios
      .post("/api/find-email", memberInfo)
      .then((res) => setEmail(res.data))
      .catch(() => {
        alert("일치하는 정보가 없습니다.");
      });
  }

  return (
    <Box>
      <Flex w={"100%"} h={"100%"}>
        <Box w={"70%"}>
          <FormControl my={"5px"}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color={"gray.400"}>
                <FontAwesomeIcon icon={faUser} />
              </InputLeftElement>
              <Input
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
              />
            </InputGroup>
          </FormControl>
          <FormControl>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color={"gray.400"}>
                <FontAwesomeIcon icon={faPhone} />
              </InputLeftElement>
              <Input
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호 ('-'는 빼고 적어주십시오.)"
              />
            </InputGroup>
          </FormControl>
        </Box>
        <Box w={"20%"} ml={3} pt={"5px"}>
          <Button
            w={"100%"}
            h={"100%"}
            colorScheme={"orange"}
            onClick={handleFindEmailBtn}
          >
            이메일 찾기
          </Button>
        </Box>
      </Flex>
      <Center
        w={"93%"}
        border={"3px solid gray"}
        mt={"30px"}
        h={"40px"}
        borderRadius={"20px"}
      >
        <Center w={"100px"} h={"40px"} lineHeight={"40px"}>
          내 이메일 :
        </Center>
        <Center w={"60%"} h={"40px"}>
          {email}
        </Center>
      </Center>
    </Box>
  );
}
