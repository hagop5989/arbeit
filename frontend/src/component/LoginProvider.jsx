import { createContext, useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expired, setExpired] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login(token);
    }
  }, []);

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
  }

  return (
    <LoginContext.Provider
      value={{
        id,
        email,
        name,
        login,
        logout,
        isLoggedIn,
        hasAccess,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
