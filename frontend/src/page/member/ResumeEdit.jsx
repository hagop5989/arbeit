import { Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";

export function ResumeEdit() {
  const { id } = useParams();
  const [resume, setResume] = useState({});
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/resume/${account.id}/${id}`);
  }, []);
  return <Box></Box>;
}
