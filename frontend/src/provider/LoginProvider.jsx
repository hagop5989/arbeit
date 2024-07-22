import { createContext, useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authority, setAuthority] = useState("");
  const [expired, setExpired] = useState(0);
  const [alarmNum, setAlarmNum] = useState(0);
  const [scrapNum, setScrapNum] = useState(0);
  const [recentJobPages, setRecentJobPages] = useState(
    JSON.parse(localStorage.getItem("recentJobPages")) || [],
  ); // 최근 본 공고 페이지 URL을 저장하는 상태
  const [postCheck, setPostCheck] = useState(false);

  useEffect(() => {
    const storedScrapNum = localStorage.getItem("scrapNum");
    if (storedScrapNum !== null) {
      setScrapNum(parseInt(storedScrapNum, 20));
    }

    const token = localStorage.getItem("token");
    if (token) {
      login(token);
    }
  }, [id]);

  // boss 이면 지원 list 데이터 받아오기
  useEffect(() => {
    if (isBoss()) {
      axios.get("/api/application-manage/count").then((res) => {
        setAlarmNum(res.data);
      });
    }
    if (isAlba()) {
      axios.get("/api/applications-count").then((res) => {
        setAlarmNum(res.data);
      });
    }
    axios.get("/api/scrap/count").then((res) => {
      setScrapNum(res.data);
    });
  }, [authority, postCheck]);

  // 최근 본 공고 페이지 URL을 추가하는 함수
  function addRecentJob(url, title) {
    setRecentJobPages((prevJobs) => {
      const newJob = { url, title };
      const filteredJobs = prevJobs.filter((job) => job.url !== url);
      const updatedJobs = [newJob, ...filteredJobs].slice(0, 10); // 중복 제거 및 최대 10개로 제한
      localStorage.setItem("recentJobPages", JSON.stringify(updatedJobs));
      return updatedJobs;
    });
  }
  // scrapNum 업데이트 함수
  function updateScrapNum(count) {
    setScrapNum(count);
    localStorage.setItem("scrapNum", count.toString());
  }

  // isLoggedIn
  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  // login
  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
    }
    setExpired(payload.exp);
    setId(payload.sub);
    setEmail(payload.email);
    setName(payload.name);
    setAuthority(payload.scope);
  }

  // 권한
  function hasAccess(param) {
    return id == param;
  }

  // logout
  function logout() {
    localStorage.removeItem("token");
    setExpired(0);
    setId("");
    setEmail("");
    setName("");
    setAuthority("");
    setAlarmNum(0);
  }

  // 권한 확인
  function isAlba() {
    return authority === "ALBA";
  }

  function isBoss() {
    return authority === "BOSS";
  }

  function isAdmin() {
    return authority === "ADMIN";
  }

  return (
    <LoginContext.Provider
      value={{
        id,
        email,
        name,
        authority,
        login,
        logout,
        isLoggedIn,
        hasAccess,
        isAlba,
        isBoss,
        isAdmin,
        alarmNum,
        addRecentJob,
        recentJobPages,
        scrapNum,
        setScrapNum,
        updateScrapNum,
        setPostCheck,
        postCheck,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
