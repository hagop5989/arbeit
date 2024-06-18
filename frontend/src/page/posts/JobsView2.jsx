import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  CompanyInfo,
  JobConditions,
  JobContact,
  JobDetail,
  JobDetails,
  JobLocation,
  JobRequirements,
  JobReview,
} from "./test)JobsDetail.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function JobsView2() {
  const account = useContext(LoginContext);
  const { id } = useParams();
  const [jobs, setJobs] = useState({});
  const [jobsCond, setJobsCond] = useState({});
  const [storeMap, setStoreMap] = useState({});
  const [images, setImages] = useState([]);
  const [boss, setBoss] = useState({});

  const toast = useToast();

  function myToast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  const navigate = useNavigate();

  function handleRemoveBtn() {
    axios.delete(`/api/jobs/${id}`).then(() => navigate("/jobs/list"));
  }

  // Read
  useEffect(() => {
    axios
      .get(`/api/jobs/${id}`)
      .then((res) => {
        setJobs(res.data.jobs);
        setJobsCond(res.data.jobsCondition);
        setImages(res.data.images);
        setStoreMap(res.data.storeMap);
        setBoss(res.data.boss);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          myToast("해당 게시물이 존재하지 않습니다", "error");
          navigate("/jobs/list");
        }
      });
  }, [id]);
  // 스피너

  if (!jobs || !jobsCond) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center flexDirection="column" p={5} bg="#f7f9fc">
      <Stack spacing={6}>
        <JobDetail job={jobs} jobsCond={jobsCond} storeMap={storeMap} />
        <Divider />
        <JobRequirements job={jobs} jobsCond={jobsCond} />
        <Divider />
        <JobLocation job={jobs} jobsCond={jobsCond} storeMap={storeMap} />
        <Divider />
        <JobConditions job={jobs} jobsCond={jobsCond} />
        <Divider />
        <JobDetails job={jobs} jobsCond={jobsCond} images={images} />
        <Divider />
        <JobContact job={jobs} jobsCond={jobsCond} boss={boss} />
        <Divider />
        <CompanyInfo
          job={jobs}
          jobsCond={jobsCond}
          storeMap={storeMap}
          boss={boss}
        />
        <Divider />
        <JobReview job={jobs} jobsCond={jobsCond} />
      </Stack>
      <Flex gap={5} my={"25px"}>
        <Button
          onClick={() => navigate("/jobs/list")}
          w={"100px"}
          colorScheme={"green"}
        >
          목록
        </Button>
        {account.isAlba() && (
          <Button
            onClick={() => navigate(`/jobs/${id}/apply`)}
            w={"100px"}
            colorScheme={"blue"}
          >
            지원하기
          </Button>
        )}
        {account.isBoss() && (
          <Flex gap={5}>
            <Button
              onClick={() => navigate(`/jobs/${id}/edit`)}
              w={"100px"}
              colorScheme={"purple"}
            >
              수정
            </Button>
            <Button onClick={handleRemoveBtn} w={"100px"} colorScheme={"red"}>
              삭제
            </Button>
          </Flex>
        )}
      </Flex>
    </Center>
  );
}

export default JobsView2;
