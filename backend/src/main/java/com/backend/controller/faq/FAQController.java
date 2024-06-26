package com.backend.controller.faq;

import com.backend.domain.faq.FAQ;
import com.backend.service.faq.FAQService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
public class FAQController {

    private final FAQService Service;

    @GetMapping("/Wlist")
    public List<FAQ> workfaq() {
        return Service.Wfaq();
    }

    @GetMapping("/Blist")
    public List<FAQ> bossfaq() {
        return Service.Bfaq();
    }

    @PostMapping("wadd")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void addFAQw(@RequestBody FAQ faq) {
        Service.addW(faq);
    }

    @PostMapping("badd")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void addFAQb(@RequestBody FAQ faq) {
        Service.addB(faq);
    }

    @PutMapping("/w/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void Wupdate(@RequestBody FAQ faq) {
        Service.updateW(faq);
    }

    @PutMapping("/b/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void Bupdate(@RequestBody FAQ faq) {
        Service.updateB(faq);
    }

    @DeleteMapping("/w/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void Wdelete(@PathVariable Integer id) {
        Service.deleteW(id);
    }

    @DeleteMapping("/b/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void Bdelete(@PathVariable Integer id) {
        Service.deleteB(id);
    }


}
