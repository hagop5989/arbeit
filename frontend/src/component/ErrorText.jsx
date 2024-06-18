import { Text } from "@chakra-ui/react";

const ErrorText = ({ children }) => {
  return (
    <Text fontSize="sm" color={"red"} mb={2}>
      {children}
    </Text>
  );
};

export default ErrorText;
