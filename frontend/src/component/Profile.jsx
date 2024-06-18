import { Box, Center, Image, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export function Profile() {
  const account = useContext(LoginContext);
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (account.id !== "") {
      axios.get(`/api/profile/${account.id}`).then((res) => setSrc(res.data));
    }
  }, [account.id]);

  return (
    <Box width={"80%"}>
      <Box w={"100%"} height={"160px"} mb={"20px"}>
        <Image
          borderRadius={150}
          border={"2px solid gray"}
          w={"100%"}
          h={"100%"}
          src={src}
        />
      </Box>
      <Center mb={"10px"}>마이페이지</Center>
      <Center
        w={"100%"}
        height={"50px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={150}
      >
        <Text>지원 내역</Text>
        <Center
          w={"30px"}
          h={"30px"}
          bg={"yellow"}
          color={"black"}
          borderRadius={150}
          ml={"20px"}
        >
          <FontAwesomeIcon icon={faBell} />
        </Center>
      </Center>
    </Box>
  );
}
