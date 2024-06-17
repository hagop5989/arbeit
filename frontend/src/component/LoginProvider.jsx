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
  const [alarmNum, setAlarmNum] = useState("");
  const [recentJobPages, setRecentJobPages] = useState([]); // 최근 본 공고 페이지 URL을 저장하는 상태

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login(token);
    }
  }, []);

  // boss 이면 지원 list 데이터 받아오기
  useEffect(() => {
    if (isBoss())
      axios
        .get("/api/jobs/management/alarm-count")
        .then((res) => {
          setAlarmNum(res.data);
        })
        .catch()
        .finally(() => {});
  }, [authority]);

  // 최근 본 공고 페이지 URL을 추가하는 함수
  function addRecentJob(url) {
    setRecentJobPages((prevJobs) =>
      [...new Set([url, ...prevJobs])].slice(0, 10),
    ); // 중복 제거 및 최대 10개로 제한
  }

  // isLoggedIn
  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  // login
  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
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
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
