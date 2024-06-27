import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { JobsViewDetails } from "./jobsview_component/JobsViewDetail.jsx";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { JobConditions } from "./jobsview_component/JobConditions.jsx";
import { JobDetail } from "./jobsview_component/JobDetail.jsx";
import { JobLocation } from "./jobsview_component/JobLocation.jsx";
import { JobContact } from "./jobsview_component/JobContact.jsx";
import { CompanyInfo } from "./jobsview_component/CompanyInfo.jsx";
import { JobReview } from "./jobsview_component/JobReview.jsx";
import { JobRequirements } from "./jobsview_component/JobRequirements.jsx";
import { ApplicationWriteModal } from "../application/ApplicationWriteModal.jsx";

export function JobsView() {
  const account = useContext(LoginContext);
  const { id } = useParams();
  const location = useLocation();
  const [jobs, setJobs] = useState(null);
  const [jobsCond, setJobsCond] = useState(null);
  const [storeMap, setStoreMap] = useState({});
  const [images, setImages] = useState([]);
  const [boss, setBoss] = useState({});
  const [src, setSrc] = useState("/public/alba_connector_store_logo.png");

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          myToast("마감 되었거나, 존재하지 않는 게시물 입니다", "error");
          navigate("/jobs/list");
        }
      });
    const params = new URLSearchParams(location.search);
    console.log(params.get("modal"));
    if (params.get("modal") === "open") {
      onOpen();
    }
  }, [id, location.search]);

  useEffect(() => {
    if (storeMap && Array.isArray(storeMap.images)) {
      // images 배열의 각 항목을 순회하며 src 값을 출력
      storeMap.images.forEach((image) => {
        setSrc(image.src);
      });
    }
  }, [storeMap]);

  function handleRemoveBtn() {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (confirm) {
      axios.delete(`/api/jobs/${id}`).then(() => navigate("/jobs/list"));
    }
  }

  // 스피너
  if (jobs === null && jobsCond === null) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center flexDirection="column" p={5} bg="#f7f9fc">
      <Stack spacing={6}>
        <JobDetail jobs={jobs} jobsCond={jobsCond} src={src} />
        <Divider />
        <JobRequirements
          onOpen={onOpen}
          job={jobs}
          jobsCond={jobsCond}
          id={id}
        />
        <Divider />
        <JobLocation storeMap={storeMap} />
        <Divider />
        <JobConditions job={jobs} jobsCond={jobsCond} />
        <Divider />
        <JobsViewDetails
          onOpen={onOpen}
          job={jobs}
          jobsCond={jobsCond}
          images={images}
          storeMap={storeMap}
        />
        <Divider />
        <JobContact boss={boss} storeMap={storeMap} />
        <Divider />
        <CompanyInfo
          job={jobs}
          jobsCond={jobsCond}
          storeMap={storeMap}
          boss={boss}
          src={src}
        />
        <Divider />
        <JobReview />
      </Stack>
      {account.isAlba() && (
        <>
          <Flex w={"100%"} gap={5} my={"40px"}>
            <Button
              onClick={() => navigate("/jobs/list")}
              w={"50%"}
              colorScheme={"green"}
            >
              목록
            </Button>
            <Button onClick={onOpen} w={"50%"} colorScheme={"blue"}>
              지원하기
            </Button>
          </Flex>
          <ApplicationWriteModal
            id={id}
            src={src}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        </>
      )}

      {account.hasAccess(jobs.memberId) && (
        <Flex w={"100%"} gap={2} my={"40px"}>
          <Button
            onClick={() => navigate(`/jobs/${id}/edit`)}
            w={"50%"}
            colorScheme={"blue"}
            variant={"outline"}
          >
            수정
          </Button>
          <Button
            onClick={handleRemoveBtn}
            w={"50%"}
            colorScheme={"red"}
            variant={"outline"}
          >
            삭제
          </Button>
        </Flex>
      )}
    </Center>
  );
}

export default JobsView;
