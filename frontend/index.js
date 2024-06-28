import { extendTheme } from "@chakra-ui/react";
import "./index.css";

const theme = extendTheme({
  fonts: {
    body: "'Pretendard-Regular', sans-serif", // 본문 텍스트에 적용
    heading: "'Pretendard-Regular', sans-serif", // 제목 텍스트에 적용
  },
});

export default theme;
