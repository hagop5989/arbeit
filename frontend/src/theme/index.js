import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'Freesentation-9Black', sans-serif",
    body: "'Freesentation-9Black', sans-serif",
  },
  styles: {
    global: {
      "@font-face": {
        fontFamily: "Freesentation-9Black",
        src: "url('https://fastly.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-9Black.woff2') format('woff')",
        fontWeight: "400",
        fontStyle: "normal",
      },
      body: {
        fontFamily: "'Freesentation-9Black', sans-serif",
      },
    },
  },
});

export default theme;
