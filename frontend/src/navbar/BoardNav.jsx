import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export function BoardNav() {
  const navigate = useNavigate();
  return (
    <>
      <Box onClick={() => navigate("/list")}>/list</Box>
      <Box onClick={() => navigate("/write")}>/write</Box>
    </>
  );
}
