package com.exportpro.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exportpro.backend.repository.SiteContentRepository;

@RestController
@RequestMapping("/api/public/content")
public class PublicContentController {

    private final SiteContentRepository siteContentRepository;

    public PublicContentController(SiteContentRepository siteContentRepository) {
        this.siteContentRepository = siteContentRepository;
    }

    @GetMapping("/{pageKey}")
    public ResponseEntity<?> getContent(@PathVariable String pageKey) {
        return siteContentRepository.findByPageKey(pageKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}