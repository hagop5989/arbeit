package com.backend.controller.store;

import com.backend.domain.store.Store;
import com.backend.service.store.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService service;

    @PostMapping("/add")
    public ResponseEntity add(@RequestBody Store store) {
        if (service.validate(store)) {
            service.add(store);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Validation failed");
        }
    }

    @GetMapping("list")
    public List<Store> list() {
        return service.list();
    }

    @GetMapping("{id}")
    public ResponseEntity get(@PathVariable Integer id) {
        Store store = service.get(id);

        return ResponseEntity.ok().body(store);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Integer id) {
        service.remove(id);
    }

    @PutMapping("edit")
    public ResponseEntity edit(@RequestBody Store store) {
        service.edit(store);
        return ResponseEntity.ok().build();
    }

}
