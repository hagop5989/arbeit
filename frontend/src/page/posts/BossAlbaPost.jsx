import { Box, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function BossAlbaPost() {
  const navigate = useNavigate();
  return (
    <Flex height={"80vh"} alignItems="center" justifyContent={"center"}>
      <Box>
        <Heading>알바공고</Heading>

        <Box>
          <Flex>
            <Box
              onClick={() => navigate("/bossAlbaPostCreate")}
              textAlign="center"
              fontSize="3rem"
              margin="30px"
              borderRadius="md"
              border="3px solid black"
              boxSize={"300px"}
              lineHeight={"300px"}
              fontWeight={500}
              cursor={"pointer"}
            >
              생성하기
            </Box>
            <Box
              onClick={() => navigate("/bossAlbaPostManage")}
              textAlign="center"
              fontSize="3rem"
              margin="30px"
              borderRadius="md"
              border="3px solid black"
              boxSize={"300px"}
              lineHeight={"300px"}
              fontWeight={500}
              cursor={"pointer"}
            >
              관리하기
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
