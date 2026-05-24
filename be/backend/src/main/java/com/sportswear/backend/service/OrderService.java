package com.sportswear.backend.service;

import com.sportswear.backend.dto.order.*;
import com.sportswear.backend.entity.*;
import com.sportswear.backend.exception.ResourceNotFoundException;
import com.sportswear.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentStatusRepository paymentStatusRepository;
    private final UserService userService;

    @Transactional
    public OrderResponse checkout(OrderRequest request) {
        User currentUser = userService.getCurrentUser();

        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cannot checkout with empty cart");
        }

        // Lấy status mặc định "PENDING" khi tạo order mới
        OrderStatus pendingStatus = orderStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new ResourceNotFoundException("Order status PENDING not found"));

        Order order = new Order();
        order.setUser(currentUser);
        order.setShippingInfo(request.getShippingInfo());
        order.setOrderStatus(pendingStatus);

       // Lấy payment method từ request
        PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));

        // Tự động set payment status = PENDING khi mới checkout
        PaymentStatus pendingPaymentStatus = paymentStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new ResourceNotFoundException("Payment status PENDING not found"));

        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(pendingPaymentStatus);

        // Chuyển items từ Cart sang Order
        for (CartItem cartItem : cart.getCartItems()) {
            ProductVariant variant = cartItem.getVariant();

            // Kiểm tra stock ở variant
            if (variant.getStock() < cartItem.getQuantity()) {
                throw new IllegalStateException(
                        "Sản phẩm " + cartItem.getProduct().getName() +
                                " (Size: " + variant.getSize().getName() +
                                ", Màu: " + variant.getColor() + ") không đủ hàng"
                );
            }

            // Trừ stock trên variant
            variant.setStock(variant.getStock() - cartItem.getQuantity());

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

        // Tính tổng tiền từ orderItems vì không có calculateTotal()
        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(item -> item.getPriceAtTime()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Xoá giỏ hàng sau khi checkout thành công
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return mapToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        User currentUser = userService.getCurrentUser();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
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

        // Lấy OrderStatus "CANCELLED" từ DB
        OrderStatus cancelledStatus = orderStatusRepository.findByName("CANCELLED")
                .orElseThrow(() -> new ResourceNotFoundException("Order status CANCELLED not found"));

        order.setOrderStatus(cancelledStatus);

        return mapToResponse(orderRepository.save(order));
    }
    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getAllOrders(String status) {
        List<Order> orders;

        if (status != null) {
            orders = orderRepository.findByOrderStatus_Name(status);
        } else {
            orders = orderRepository.findAll();
        }

        return orders.stream()
                .map(this::mapToAdminResponse)
                .collect(Collectors.toList());
    }

    // Lấy chi tiết đơn hàng cho Admin (không check quyền user)
    @Transactional(readOnly = true)
    public AdminOrderResponse getOrderDetailForAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        return mapToAdminResponse(order);
    }

    //  Cập nhật trạng thái đơn hàng
    @Transactional
    public AdminOrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        OrderStatus newStatus = orderStatusRepository.findByName(status)
                .orElseThrow(() -> new ResourceNotFoundException("Order status not found: " + status));

        order.setOrderStatus(newStatus);
        return mapToAdminResponse(orderRepository.save(order));
    }

    // Helper convert cho Admin
    private AdminOrderResponse mapToAdminResponse(Order order) {
        ShippingInfo shipping = order.getShippingInfo();

        return AdminOrderResponse.builder()
                .orderId(order.getId())
                .customerName(shipping != null ? shipping.getFullName() : null)
                .phoneNumber(shipping != null ? shipping.getPhone() : null)
                .shippingAddress(shipping != null ? shipping.getAddress() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getOrderStatus().getName())
                .paymentMethod(order.getPaymentMethod().getName())
                .paymentStatus(order.getPaymentStatus().getName())
                .createdAt(order.getCreatedAt())
                .build();
    }

    // ==================== Helper methods ====================

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setStatus(order.getOrderStatus().getName());
        response.setTotalAmount(order.getTotalAmount());
        response.setShippingInfo(order.getShippingInfo());
        response.setCreatedAt(order.getCreatedAt());

        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(item -> {
            OrderItemDto dto = new OrderItemDto();
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProductName());
            dto.setSize(item.getSize());
            dto.setColor(item.getColor());
            dto.setPrice(item.getPriceAtTime());
            dto.setQuantity(item.getQuantity());
            dto.setSubtotal(item.getPriceAtTime()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));
            return dto;
        }).collect(Collectors.toList());

        response.setItems(itemDtos);
        return response;
    }
}