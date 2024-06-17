import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'Pretendard-Regular', sans-serif",
    body: "'Pretendard-Regular', sans-serif",
  },
  styles: {
    global: {
      "@font-face": {
        fontFamily: "Pretendard-Regular",
        src: "url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff')",
        fontWeight: "400",
        fontStyle: "normal",
      },
      body: {
        fontFamily: "'Pretendard-Regular', sans-serif",
      },
    },
  },
});

export default theme;
