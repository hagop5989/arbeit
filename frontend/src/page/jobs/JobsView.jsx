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
} from "./JobsViewDetail.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function JobsView() {
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

  function handleApplyBtn() {
    const jobsId = new URLSearchParams();
    jobsId.append("jobsId", id);
    axios
      .post("/api/apply-validate", jobsId)
      .then(() => navigate(`/jobs/${id}/apply`))
      .catch((err) => alert(err.response.data));
  }

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
        <JobRequirements job={jobs} jobsCond={jobsCond} id={id} />
        <Divider />
        <JobLocation job={jobs} jobsCond={jobsCond} storeMap={storeMap} />
        <Divider />
        <JobConditions job={jobs} jobsCond={jobsCond} />
        <Divider />
        <JobDetails job={jobs} jobsCond={jobsCond} images={images} />
        <Divider />
        <JobContact
          job={jobs}
          jobsCond={jobsCond}
          boss={boss}
          storeMap={storeMap}
        />
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
      {account.isAlba() && (
        <Flex w={"100%"} gap={5} my={"40px"}>
          <Button
            onClick={() => navigate("/jobs/list")}
            w={"50%"}
            colorScheme={"green"}
          >
            목록
          </Button>
          <Button onClick={handleApplyBtn} w={"50%"} colorScheme={"blue"}>
            지원하기
          </Button>
        </Flex>
      )}

      {account.isBoss() && (
        <Flex w={"100%"} gap={5} my={"40px"}>
          <Button
            onClick={() => navigate(`/jobs/${id}/edit`)}
            w={"50%"}
            colorScheme={"purple"}
          >
            수정
          </Button>
          <Button onClick={handleRemoveBtn} w={"50%"} colorScheme={"red"}>
            삭제
          </Button>
        </Flex>
      )}
    </Center>
  );
}

export default JobsView;
