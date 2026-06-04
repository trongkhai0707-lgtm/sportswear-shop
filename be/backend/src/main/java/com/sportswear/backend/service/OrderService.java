package com.sportswear.backend.service;

import com.sportswear.backend.dto.order.*;
import com.sportswear.backend.entity.*;
import com.sportswear.backend.exception.ResourceNotFoundException;
import com.sportswear.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentStatusRepository paymentStatusRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserService userService;

    @Transactional
    public OrderResponse checkout(OrderRequest request) {
        User currentUser = userService.getCurrentUser();
        log.info("Checkout started for user: {}", currentUser.getUsername());

        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            log.warn("Checkout failed - cart is empty for user: {}", currentUser.getUsername());
            throw new IllegalStateException("Cannot checkout with empty cart");
        }

        OrderStatus pendingStatus = orderStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new ResourceNotFoundException("Order status PENDING not found"));
        PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));
        PaymentStatus pendingPaymentStatus = paymentStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new ResourceNotFoundException("Payment status PENDING not found"));

        Order order = new Order();
        order.setUser(currentUser);
        order.setShippingInfo(request.getShippingInfo());
        order.setOrderStatus(pendingStatus);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(pendingPaymentStatus);

        for (CartItem cartItem : cart.getCartItems()) {
            ProductVariant variant = cartItem.getVariant();
            if (variant.getStock() < cartItem.getQuantity()) {
                log.warn("Insufficient stock - product: {}, variantId: {}", cartItem.getProduct().getName(), variant.getId());
                throw new IllegalStateException(
                        "Sản phẩm " + cartItem.getProduct().getName() +
                                " (Size: " + variant.getSize().getName() +
                                ", Màu: " + variant.getColor() + ") không đủ hàng"
                );
            }
            variant.setStock(variant.getStock() - cartItem.getQuantity());
            productVariantRepository.save(variant);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setVariant(cartItem.getVariant());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setSize(cartItem.getVariant().getSize().getName());
            orderItem.setColor(cartItem.getVariant().getColor());
            orderItem.setPriceAtTime(cartItem.getPriceAtTime());
            orderItem.setQuantity(cartItem.getQuantity());
            order.addOrderItem(orderItem);
        }

        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(item -> item.getPriceAtTime().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        log.info("Order created - orderId: {}, user: {}, total: {}", savedOrder.getId(), currentUser.getUsername(), totalAmount);

        cart.getCartItems().clear();
        cartRepository.save(cart);

        return mapToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        User currentUser = userService.getCurrentUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        User currentUser = userService.getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You don't have permission to view this order");
        }
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        User user = userService.getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Không có quyền hủy đơn này");
        }
        if (!"PENDING".equals(order.getOrderStatus().getName())) {
            throw new IllegalStateException("Chỉ có thể hủy đơn hàng ở trạng thái PENDING");
        }

        OrderStatus cancelledStatus = orderStatusRepository.findByName("CANCELLED")
                .orElseThrow(() -> new ResourceNotFoundException("Order status CANCELLED not found"));

        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getVariant();
            variant.setStock(variant.getStock() + item.getQuantity());
            productVariantRepository.save(variant);
            log.debug("Stock restored - variantId: {}, qty: {}", variant.getId(), item.getQuantity());
        }

        order.setOrderStatus(cancelledStatus);
        log.info("Order cancelled - orderId: {}", orderId);
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getAllOrders(String status) {
        List<Order> orders = (status != null && !status.isBlank())
                ? orderRepository.findByOrderStatus_Name(status.toUpperCase())
                : orderRepository.findAll();
        return orders.stream().map(this::mapToAdminResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminOrderResponse getOrderDetailForAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        return mapToAdminResponse(order);
    }

    @Transactional
    public AdminOrderResponse updateOrderStatus(Long orderId, String status) {
        log.info("Admin updating order status - orderId: {}, newStatus: {}", orderId, status);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        OrderStatus newStatus = orderStatusRepository.findByName(status.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Order status not found: " + status));
        order.setOrderStatus(newStatus);
        return mapToAdminResponse(orderRepository.save(order));
    }

    @Transactional
    public AdminOrderResponse updatePaymentStatus(Long orderId, String status) {
        log.info("Admin updating payment status - orderId: {}, newStatus: {}", orderId, status);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        PaymentStatus newStatus = paymentStatusRepository.findByName(status.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Payment status not found: " + status));
        order.setPaymentStatus(newStatus);
        return mapToAdminResponse(orderRepository.save(order));
    }

    // ==================== Helper methods ====================

    private AdminOrderResponse mapToAdminResponse(Order order) {
        ShippingInfo shipping = order.getShippingInfo();
        return AdminOrderResponse.builder()
                .orderId(order.getId())
                .customerName(shipping != null ? shipping.getFullName() : null)
                .customerEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .phoneNumber(shipping != null ? shipping.getPhone() : null)
                .shippingAddress(shipping != null ? shipping.getAddress() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getOrderStatus().getName())
                .paymentMethod(order.getPaymentMethod().getName())
                .paymentStatus(order.getPaymentStatus().getName())
                .createdAt(order.getCreatedAt())
                .items(order.getOrderItems().stream().map(item -> {
                    OrderItemDto dto = new OrderItemDto();
                    dto.setProductId(item.getProduct().getId());
                    dto.setProductName(item.getProductName());
                    dto.setSize(item.getSize());
                    dto.setColor(item.getColor());
                    dto.setPrice(item.getPriceAtTime());
                    dto.setQuantity(item.getQuantity());
                    dto.setSubtotal(item.getPriceAtTime().multiply(BigDecimal.valueOf(item.getQuantity())));
                    return dto;
                }).collect(Collectors.toList()))
                .build();
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setStatus(order.getOrderStatus().getName());
        response.setTotalAmount(order.getTotalAmount());
        response.setShippingInfo(order.getShippingInfo());
        response.setPaymentMethod(order.getPaymentMethod().getName());
        response.setPaymentStatus(order.getPaymentStatus().getName());
        response.setCreatedAt(order.getCreatedAt());
        response.setItems(order.getOrderItems().stream().map(item -> {
            OrderItemDto dto = new OrderItemDto();
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProductName());
            dto.setSize(item.getSize());
            dto.setColor(item.getColor());
            dto.setPrice(item.getPriceAtTime());
            dto.setQuantity(item.getQuantity());
            dto.setSubtotal(item.getPriceAtTime().multiply(BigDecimal.valueOf(item.getQuantity())));
            return dto;
        }).collect(Collectors.toList()));
        return response;
    }
}
