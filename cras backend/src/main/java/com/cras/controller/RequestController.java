package com.cras.controller;

import com.cras.entity.Request;
import com.cras.repository.RequestRepository;
import com.cras.service.SeverityService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin
public class RequestController {

    private final RequestRepository repository;
    private final SeverityService severityService;

    public RequestController(RequestRepository repository,
                              SeverityService severityService) {
        this.repository = repository;
        this.severityService = severityService;
    }


    @PostMapping
    public Request createRequest(@RequestBody Request request) {

        // Calculate severity automatically
        double severity =
                severityService.calculateSeverity(request);

        // Save calculated severity in the request
        request.setSeverity(severity);

        // Save request + severity to MySQL
        return repository.save(request);
    }

    @GetMapping("/{id}")
    public Request getRequest(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }
}
