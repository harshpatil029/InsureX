package com.insurance.management.services;

import com.insurance.management.dto.CreateCustomerRequestDTO;
import com.insurance.management.dto.UpdateCustomerRequestDTO;
import com.insurance.management.dto.CustomerResponseDTO;

import java.util.List;

public interface CustomerService {
    CustomerResponseDTO createCustomer(CreateCustomerRequestDTO request);

    CustomerResponseDTO updateCustomer(Long id, UpdateCustomerRequestDTO request);

    CustomerResponseDTO getCustomerById(Long id);

    CustomerResponseDTO getCustomerByUserId(Long userId);

    List<CustomerResponseDTO> getAllCustomers();

    void deleteCustomer(Long id);
}
