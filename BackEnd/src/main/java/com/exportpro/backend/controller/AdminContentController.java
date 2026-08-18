package com.exportpro.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exportpro.backend.dto.SiteContentRequest;
import com.exportpro.backend.model.SiteContent;
import com.exportpro.backend.repository.SiteContentRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/content")
public class AdminContentController {

    private final SiteContentRepository siteContentRepository;

    public AdminContentController(SiteContentRepository siteContentRepository) {
        this.siteContentRepository = siteContentRepository;
    }

    @GetMapping
    public ResponseEntity<List<SiteContent>> getAllContent() {
        return ResponseEntity.ok(siteContentRepository.findAll());
    }

    @PutMapping("/{pageKey}")
    public ResponseEntity<SiteContent> updateContent(@PathVariable String pageKey,
                                                       @Valid @RequestBody SiteContentRequest request) {
        SiteContent content = siteContentRepository.findByPageKey(pageKey)
                .orElseGet(() -> {
                    SiteContent newContent = new SiteContent();
                    newContent.setPageKey(pageKey);
                    return newContent;
                });

        content.setTitle(request.getTitle());
        content.setBody(request.getBody());
        content.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(siteContentRepository.save(content));
    }
}