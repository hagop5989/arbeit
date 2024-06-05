import { Box, Heading } from "@chakra-ui/react";
import { MemberNav } from "./navbar/MemberNav.jsx";
import { BossNav } from "./navbar/BossNav.jsx";
import { StoreNav } from "./navbar/StoreNav.jsx";
import { BoardNav } from "./navbar/BoardNav.jsx";

export function NavComponent() {
  return (
    <Box ml={10}>
      <Box>
        <Heading>하정현 작업물</Heading>
        <MemberNav />
      </Box>
      <br />
      <Box>
        <Heading>장대성 작업물</Heading>
        <BossNav />
      </Box>
      <br />
      <Box>
        <Heading>박정희 작업물</Heading>
        <StoreNav />
      </Box>
      <br />
      <Box>
        <Heading>정태욱 작업물</Heading>
        <BoardNav />
      </Box>
    </Box>
  );
}
