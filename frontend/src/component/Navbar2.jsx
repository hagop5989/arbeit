import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Spacer, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";

function Navbar(props) {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [showBoxes, setShowBoxes] = useState(true);
  useEffect(() => {
    setShowBoxes(account.isLoggedIn());
    console.log(account.email);
  }, [account]);

  const navCss = {
    fontSize: "1.5rem",
    cursor: "pointer",
    _hover: { bgColor: "gray.100" },
    padding: "3px",
    borderRadius: "md",
  };

  return (
    <Box marginY={"20px"}>
      <Flex gap={3}>
        <Box onClick={() => navigate("/")} {...navCss} mx={5}>
          <FontAwesomeIcon icon={faHouse} />
        </Box>
        <Spacer w={1350} />
        <Box>
          <Flex gap={3}>
            {account.isLoggedIn() && (
              <Box {...navCss} cursor={"default"}>
                {account.email}님
                <FontAwesomeIcon icon={faUser} />
              </Box>
            )}
            <VStack display={!showBoxes ? "block" : "none"}>
              <Flex>
                <Box onClick={() => navigate("/bossSignup")} {...navCss}>
                  회원가입
                </Box>
                <Box onClick={() => navigate("/bossLogin")} {...navCss}>
                  로그인
                </Box>
              </Flex>
            </VStack>
            <VStack display={showBoxes ? "block" : "none"}>
              <Flex gap={3}>
                <Box onClick={() => navigate("/bossAlbaPost")} {...navCss}>
                  알바공고
                </Box>
                <Box onClick={() => navigate("/bossEdit")} {...navCss}>
                  정보수정
                </Box>
                <Box
                  onClick={() => {
                    account.logout();
                    navigate("/bossLogin");
                  }}
                  {...navCss}
                >
                  로그아웃
                </Box>
              </Flex>
            </VStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;
