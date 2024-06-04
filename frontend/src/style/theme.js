import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    FormHelperText: {
      baseStyle: {
        color: "red",
      },
    },
  },
});

export default theme;
