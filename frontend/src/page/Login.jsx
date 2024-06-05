import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";

export function Login() {
  const [authority, setAuthority] = useState("ALBA");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");

  const account = useContext(LoginContext);

  function handleLoginBtn() {
    axios
      .post(`/api/token`, { email, password, authority })
      .then((res) => {
        account.login(res.data.token);
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally();
  }

  function handleTypeBtn(value) {
    setAuthority(value);
  }

  return (
    <Box>
      <Box>
        <Heading>로그인</Heading>
      </Box>
      <Box>
        <Box>
          <Button
            colorScheme={authority === "ALBA" ? "blue" : "gray"}
            onClick={() => handleTypeBtn("ALBA")}
          >
            알바
          </Button>
          <Button
            colorScheme={authority === "BOSS" ? "blue" : "gray"}
            onClick={() => handleTypeBtn("BOSS")}
          >
            사장
          </Button>
          <Button
            colorScheme={authority === "ADMIN" ? "blue" : "gray"}
            onClick={() => handleTypeBtn("ADMIN")}
          >
            관리자 (나중에 지울 예정)
          </Button>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input onChange={(e) => setEmail(e.target.value)} />
            {errors && <FormHelperText>{errors.email}</FormHelperText>}
            <FormLabel>비밀번호</FormLabel>
            <Input onChange={(e) => setPassword(e.target.value)} />
            {errors && <FormHelperText>{errors.password}</FormHelperText>}
          </FormControl>
        </Box>
        <Box>
          <Button onClick={handleLoginBtn}>로그인</Button>
        </Box>
      </Box>
    </Box>
  );
}
