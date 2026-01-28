package com.insurance.management.service.customer.impl;

import com.insurance.management.dto.request.customer.CreateCustomerRequestDTO;
import com.insurance.management.dto.request.customer.UpdateCustomerRequestDTO;
import com.insurance.management.dto.response.customer.CustomerResponseDTO;
import com.insurance.management.entity.Customer;
import com.insurance.management.entity.User;
import com.insurance.management.exception.ResourceNotFoundException;
import com.insurance.management.repository.CustomerRepository;
import com.insurance.management.repository.UserRepository;
import com.insurance.management.service.customer.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public CustomerResponseDTO createCustomer(CreateCustomerRequestDTO request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        }

        Customer customer = modelMapper.map(request, Customer.class);
        customer.setUser(user);
        Customer savedCustomer = customerRepository.save(customer);
        return modelMapper.map(savedCustomer, CustomerResponseDTO.class);
    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, UpdateCustomerRequestDTO request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        modelMapper.map(request, customer);
        Customer updatedCustomer = customerRepository.save(customer);
        return modelMapper.map(updatedCustomer, CustomerResponseDTO.class);
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return modelMapper.map(customer, CustomerResponseDTO.class);
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customer -> modelMapper.map(customer, CustomerResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
}
