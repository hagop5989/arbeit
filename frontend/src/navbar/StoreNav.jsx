import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export function StoreNav() {
  const navigate = useNavigate();
  return (
    <>
      <Box onClick={() => navigate("/store/list")}>/store/list</Box>
      <Box onClick={() => navigate("/store/add")}>/store/add</Box>
    </>
  );
}
