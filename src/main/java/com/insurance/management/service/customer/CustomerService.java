package com.insurance.management.service.customer;

import com.insurance.management.dto.request.customer.CreateCustomerRequestDTO;
import com.insurance.management.dto.request.customer.UpdateCustomerRequestDTO;
import com.insurance.management.dto.response.customer.CustomerResponseDTO;

import java.util.List;

public interface CustomerService {
    CustomerResponseDTO createCustomer(CreateCustomerRequestDTO request);

    CustomerResponseDTO updateCustomer(Long id, UpdateCustomerRequestDTO request);

    CustomerResponseDTO getCustomerById(Long id);

    List<CustomerResponseDTO> getAllCustomers();

    void deleteCustomer(Long id);
}
