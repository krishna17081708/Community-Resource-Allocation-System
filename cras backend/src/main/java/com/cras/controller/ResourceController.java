
package com.cras.controller;

import com.cras.entity.Resource;
import com.cras.repository.ResourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceRepository repository;

    public ResourceController(ResourceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Resource> getResources() {
        return repository.findAll();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> addResource(
            @RequestBody Resource incomingResource) {

        if (incomingResource.getName() == null
                || incomingResource.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Resource name is required.");
        }

        if (incomingResource.getUnit() == null
                || incomingResource.getUnit().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Resource unit is required.");
        }

        if (incomingResource.getAvailableQuantity() == null
                || incomingResource.getAvailableQuantity() < 0) {
            return ResponseEntity.badRequest()
                    .body("Quantity must be zero or greater.");
        }

        return repository
                .findByNameIgnoreCase(incomingResource.getName().trim())
                .map(existingResource -> {

                    // An existing resource must use the same unit.
                    if (!existingResource.getUnit().equalsIgnoreCase(
                            incomingResource.getUnit().trim())) {
                        return ResponseEntity.badRequest()
                                .body("Resource already exists with unit: "
                                        + existingResource.getUnit());
                    }

                    // Add incoming stock to existing inventory.
                    existingResource.setAvailableQuantity(
                            existingResource.getAvailableQuantity()
                                    + incomingResource.getAvailableQuantity()
                    );

                    return ResponseEntity.ok(
                            repository.save(existingResource)
                    );
                })
                .orElseGet(() -> {
                    incomingResource.setName(
                            incomingResource.getName().trim()
                    );
                    incomingResource.setUnit(
                            incomingResource.getUnit().trim()
                    );

                    return ResponseEntity.ok(
                            repository.save(incomingResource)
                    );
                });
    }
}
