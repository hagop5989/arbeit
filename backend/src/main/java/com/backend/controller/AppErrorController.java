package com.backend.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AppErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // 에러 발생시 리액트로 포워드 해서 리액트가 다시 일할 수 있게 함.
        return "/";
    }
}
