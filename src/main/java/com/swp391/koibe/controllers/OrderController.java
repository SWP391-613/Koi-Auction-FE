package com.swp391.koibe.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.swp391.koibe.dto.OrderDTO;
import com.swp391.koibe.exceptions.InvalidApiPathVariableException;
import com.swp391.koibe.exceptions.MethodArgumentNotValidException;
import com.swp391.koibe.exceptions.DataNotFoundException;
import com.swp391.koibe.services.OrderService;
import com.swp391.koibe.utils.DTOConverter;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_MEMBER')")
    public ResponseEntity<?> updateOrder(
            @Valid @PathVariable long id,
            @Valid @RequestBody OrderDTO orderDTO,
            BindingResult result) {

        if (id <= 0)
            throw new InvalidApiPathVariableException("Order id must be greater than 0");

        if (result.hasErrors())
            throw new MethodArgumentNotValidException(result);

        try {
            Order existingOrder = orderService.getOrder(id);

            // Preserve the existing status
            orderDTO.setStatus(existingOrder.getStatus());

            Order updatedOrder = orderService.updateOrder(id, orderDTO);
            return ResponseEntity.ok(DTOConverter.fromOrder(updatedOrder));
        } catch (Exception e) {
            if (e instanceof DataNotFoundException) {
                throw e;
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
