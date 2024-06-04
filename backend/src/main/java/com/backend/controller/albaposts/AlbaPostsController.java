package com.backend.controller.albaposts;

import com.backend.domain.albaposts.AlbaPosts;
import com.backend.service.albaposts.AlbaPostsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boss/post")
public class AlbaPostsController {
    private final AlbaPostsService service;

    @PostMapping("insert")
    public void insert(@RequestBody AlbaPosts albaPosts) {
        service.insert(albaPosts);
    }

    @PutMapping("update")
    public void update(@RequestBody AlbaPosts albaPosts) {
        service.update(albaPosts);
    }

    @GetMapping("select")
    public AlbaPosts selectByPostId(@RequestParam Integer postId) {
        return service.selectByPostId(postId);
    }

    @GetMapping("list")
    public List<AlbaPosts> list(@RequestParam Integer bossId) {
        return service.findAllByBossId(bossId);
    }

    @DeleteMapping("delete")
    public void delete(@RequestParam Integer postId) {
        service.deleteByPostId(postId);
    }

}
