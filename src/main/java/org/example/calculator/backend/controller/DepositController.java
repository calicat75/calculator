package org.example.calculator.backend.controller;

import jakarta.validation.Valid;
import org.example.calculator.backend.dto.DepositRequest;
import org.example.calculator.backend.dto.DepositResponse;
import org.example.calculator.backend.service.DepositService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class DepositController {

    private final DepositService depositService;

    public DepositController(DepositService depositService) {
        this.depositService = depositService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<DepositResponse> calculate(@Valid @RequestBody DepositRequest request) {
        DepositResponse response = depositService.calculate(request);
        return ResponseEntity.ok(response);
    }
}
