import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [member, setMember] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleInputChange = (prop) => (e) => {
    setMember({ ...member, [prop]: e.target.value });
  };

  return (
    <Box>
      <Box>
        <Heading>알바 회원가입</Heading>
      </Box>
      <FormControl>
        <Select
          placeholder="권한을 정해주세요."
          onChange={handleInputChange("authority")}
        >
          <option value="ALBA">알바</option>
          <option value="BOSS">사장</option>
          <option value="ADMIN">관리자 (나중에 지울 예정)</option>
        </Select>

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
