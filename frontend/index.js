import { extendTheme } from "@chakra-ui/react";
import "./index.css";

const theme = extendTheme({
  fonts: {
    body: "'ONE-Mobile-Title', sans-serif", // 본문 텍스트에 적용
    heading: "'ONE-Mobile-Title', sans-serif", // 제목 텍스트에 적용
  },
});

export default theme;
