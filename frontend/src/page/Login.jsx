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
  const [type, setType] = useState("ALBA");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");

  const account = useContext(LoginContext);

  function handleLoginBtn() {
    axios
      .post(`/api/alba/token?type=${type}`, { email, password })
      .then((res) => {
        account.login(res.data.token);
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally();
  }

  function handleTypeBtn(value) {
    setType(value);
  }

  return (
    <Box>
      <Box>
        <Heading>로그인</Heading>
      </Box>
      <Box>
        <Box>
          <Button
            colorScheme={type === "ALBA" ? "blue" : "gray"}
            onClick={() => handleTypeBtn("ALBA")}
          >
            알바
          </Button>
          <Button
            colorScheme={type === "BOSS" ? "blue" : "gray"}
            onClick={() => handleTypeBtn("BOSS")}
          >
            사장
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
