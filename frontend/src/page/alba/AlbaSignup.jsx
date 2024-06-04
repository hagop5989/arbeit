import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function AlbaSignup() {
  const [alba, setAlba] = useState({});
  const [errors, setErrors] = useState({});

  function handleSignupBtn() {
    axios
      .post("/api/alba/signup", alba)
      .then()
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally();
  }

  const handleInputChange = (prop) => (e) => {
    setAlba({ ...alba, [prop]: e.target.value });
  };

  return (
    <Box>
      <Box>
        <Heading>알바 회원가입</Heading>
      </Box>
      <FormControl>
        <FormLabel>이메일</FormLabel>
        <Input onChange={handleInputChange("email")} />
        {errors && <FormHelperText>{errors.email}</FormHelperText>}

        <FormLabel>패스워드</FormLabel>
        <Input onChange={handleInputChange("password")} />
        {errors && <FormHelperText>{errors.password}</FormHelperText>}

        <FormLabel>이름</FormLabel>
        <Input onChange={handleInputChange("name")} />
        {errors && <FormHelperText>{errors.name}</FormHelperText>}

        <FormLabel>주소</FormLabel>
        <Input onChange={handleInputChange("address")} />
        {errors && <FormHelperText>{errors.address}</FormHelperText>}

        <FormLabel>전화번호</FormLabel>
        <Input onChange={handleInputChange("phone")} />
        {errors && <FormHelperText>{errors.phone}</FormHelperText>}

        <Button onClick={handleSignupBtn}>회원가입</Button>
      </FormControl>
    </Box>
  );
}
