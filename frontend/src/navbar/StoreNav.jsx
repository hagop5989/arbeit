import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export function StoreNav() {
  const navigate = useNavigate();
  return (
    <>
      <Box onClick={() => navigate("/store/list")}>가게 목록</Box>
      <Box onClick={() => navigate("/store/register")}>가게 등록</Box>
    </>
  );
}
