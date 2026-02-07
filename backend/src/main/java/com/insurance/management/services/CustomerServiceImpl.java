package com.insurance.management.services;

import com.insurance.management.dto.CreateCustomerRequestDTO;
import com.insurance.management.dto.UpdateCustomerRequestDTO;
import com.insurance.management.dto.CustomerResponseDTO;
import com.insurance.management.entity.Customer;
import com.insurance.management.entity.User;
import com.insurance.management.exception.ResourceNotFoundException;
import com.insurance.management.repository.CustomerRepository;
import com.insurance.management.repository.UserRepository;
import com.insurance.management.services.CustomerService;
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

        // Alternative Soft Delete via Update
        if (Boolean.TRUE.equals(request.getDeleted())) {
            try {
                customer.setDeleted(true);
                Customer saved = customerRepository.save(customer); // Standard JPA Update
                return modelMapper.map(saved, CustomerResponseDTO.class);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Soft Delete via Update Failed: " + e.getMessage());
            }
        }

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
    public CustomerResponseDTO getCustomerByUserId(Long userId) {
        System.out.println("in getCustomerByUserId method of CustomerServiceImpl");
        //return customerRepository.findByUserId(userId)
        return customerRepository.findByUserId(userId)
                .map(customer -> modelMapper.map(customer, CustomerResponseDTO.class))
                .orElseGet(() -> {
                    // Self-healing: Create profile if missing for valid user
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

                    if (user.getRole() == com.insurance.management.entity.UserRole.ROLE_CUSTOMER) {
                        Customer newCustomer = new Customer();
                        newCustomer.setUser(user);
                        newCustomer.setFirstName("New");
                        newCustomer.setLastName("Customer");
                        newCustomer.setEmail(user.getEmail());
                        newCustomer.setPhone("0000000000");
                        newCustomer.setAddress("Please update your address");

                        Customer savedCustomer = customerRepository.save(newCustomer);
                        return modelMapper.map(savedCustomer, CustomerResponseDTO.class);
                    }

                    throw new ResourceNotFoundException("Customer not found for user id: " + userId);
                });
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {
        // Validation: Filter manually to prove state
        return customerRepository.findAll().stream()
                .filter(c -> !c.isDeleted())
                .map(customer -> modelMapper.map(customer, CustomerResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCustomer(Long id) {
        try {
            if (!customerRepository.existsById(id)) {
                throw new ResourceNotFoundException("Customer not found with id: " + id);
            }
            customerRepository.softDeleteById(id);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Delete Failed: " + e.getMessage());
        }
    }

    @Override
    public void deactivateCustomer(Long id) {
        deleteCustomer(id);
    }
}
