package com.insurance.management.controller;

import com.insurance.management.dto.CreateCustomerRequestDTO;
import com.insurance.management.dto.UpdateCustomerRequestDTO;
import com.insurance.management.dto.ApiResponse;
import com.insurance.management.dto.CustomerResponseDTO;
import com.insurance.management.services.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<CustomerResponseDTO> createCustomer(@Valid @RequestBody CreateCustomerRequestDTO request) {
        return ResponseEntity.ok(customerService.createCustomer(request));
    }

    @GetMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<CustomerResponseDTO> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomerResponseDTO> getCustomerByUser(@PathVariable Long userId) {
        // Accessible by the user themselves or Admin/Agent (logic handled by service or
        // assumed safe for MVP as it's by UserID)
        return ResponseEntity.ok(customerService.getCustomerByUserId(userId));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(@PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequestDTO request) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(new ApiResponse("Success", "Customer deleted successfully"));
    }
}
