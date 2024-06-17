import React, {useEffect, useState} from "react";
import {Box, Button, Center, Divider, Flex, Spinner, Stack, useToast,} from "@chakra-ui/react";
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
import {useNavigate, useParams} from "react-router-dom";

export function JobsView2() {
  const {id} = useParams();
  const [jobs, setJobs] = useState({});
  const [jobsCond, setJobsCond] = useState({});
  const [images, setImages] = useState([]);

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
        <Spinner size="xl"/>
      </Center>
    );
  }

  return (
    <Center flexDirection="column" p={5} bg="#f7f9fc">
      <Stack spacing={6}>
        <JobDetail job={jobs} jobsCond={jobsCond}/>
        <Divider/>
        <JobConditions job={jobs} jobsCond={jobsCond}/>
        <Divider/>
        <JobLocation job={jobs} jobsCond={jobsCond}/>
        <Divider/>
        <JobRequirements job={jobs} jobsCond={jobsCond}/>
        <Divider/>
        <JobDetails job={jobs} jobsCond={jobsCond}/>
        <Divider/>
        <JobContact job={jobs} jobsCond={jobsCond}/>
        <Divider/>
        <CompanyInfo job={jobs} jobsCond={jobsCond}/>
        <Divider/>
        <JobReview job={jobs} jobsCond={jobsCond}/>
      </Stack>
      <Flex><Button onClick={() => navigate("/jobs/list")}>목록</Button>
        <Button onClick={() => navigate(`/jobs/${id}/apply`)}>지원하기</Button>
        <Button onClick={() => navigate(`/jobs/${id}/edit)`)}>수정</Button>
        <Button onClick={handleRemoveBtn}>삭제</Button></Flex>
    </Center>
  );
}

export default JobsView2;
